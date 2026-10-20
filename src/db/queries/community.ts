import "server-only";
import { sql } from "drizzle-orm";
import { z } from "zod";
import {
  communityDetailSchema,
  exploreCommunityListSchema,
  joinResultSchema,
  myCommunityListSchema,
  myCommunitySchema,
  type CreateCommunityInput,
  type UpdateCommunityInput,
} from "@/schemas/community";
import { likeEscape, queryJson } from "../query";
import { ownedCommunity } from "./owned";

const memberCount = sql.raw(
  `(SELECT count(*) FROM community_member cm WHERE cm.community_id = c.id)`,
);
const noteCount = sql.raw(`(SELECT count(*) FROM note n WHERE n.community_id = c.id)`);

export function listMyCommunities(userId: string) {
  return queryJson(
    myCommunityListSchema,
    sql`
      SELECT coalesce(
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'access', c.access,
            'isOwner', c.owner_id = ${userId},
            'memberCount', ${memberCount},
            'noteCount', ${noteCount}
          )
          ORDER BY c.name
        ),
        '[]'
      ) AS result
      FROM community c
      JOIN community_member m ON m.community_id = c.id AND m.user_id = ${userId}
    `,
  );
}

/** Creates the community and its owner membership. `baseSlug` gets -2, -3… when taken. */
export function createCommunity(userId: string, baseSlug: string, input: CreateCommunityInput) {
  const slugPattern = `^${baseSlug}-[0-9]+$`;
  return queryJson(
    myCommunitySchema,
    sql`
      WITH taken AS (
        SELECT slug FROM community WHERE slug = ${baseSlug} OR slug ~ ${slugPattern}
      ), pick AS (
        SELECT CASE
          WHEN NOT EXISTS (SELECT 1 FROM taken WHERE slug = ${baseSlug}) THEN ${baseSlug}
          ELSE ${baseSlug} || '-' || (
            SELECT coalesce(max(substring(slug FROM '-([0-9]+)$')::int), 1) + 1
            FROM taken WHERE slug <> ${baseSlug}
          )
        END AS slug
      ), c AS (
        INSERT INTO community (name, slug, description, access, owner_id)
        SELECT ${input.name}, pick.slug, nullif(${input.description ?? ""}, ''), ${input.access}, ${userId}
        FROM pick
        RETURNING id, name, slug, access
      ), m AS (
        INSERT INTO community_member (community_id, user_id)
        SELECT id, ${userId} FROM c
      )
      SELECT json_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug,
        'access', c.access,
        'isOwner', true,
        'memberCount', 1,
        'noteCount', 0
      ) AS result
      FROM c
    `,
  );
}

/** Public communities the user is not a member of. */
export function exploreCommunities(userId: string, q: string | undefined) {
  const search = q ? `%${likeEscape(q)}%` : null;
  return queryJson(
    exploreCommunityListSchema,
    sql`
      SELECT coalesce(
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'description', c.description,
            'access', c.access,
            'requested', EXISTS (
              SELECT 1 FROM join_request jr WHERE jr.community_id = c.id AND jr.user_id = ${userId}
            ),
            'memberCount', ${memberCount},
            'noteCount', ${noteCount}
          )
          ORDER BY c.created_at DESC
        ),
        '[]'
      ) AS result
      FROM (
        SELECT * FROM community c
        WHERE c.access <> 'private'
          AND NOT EXISTS (
            SELECT 1 FROM community_member m WHERE m.community_id = c.id AND m.user_id = ${userId}
          )
          AND (${search}::text IS NULL OR c.name ILIKE ${search})
        ORDER BY c.created_at DESC
        LIMIT 50
      ) c
    `,
  );
}

/** Community detail with the caller's membership. Private communities are hidden from non-members. */
export function getCommunity(userId: string, slug: string) {
  return queryJson(
    communityDetailSchema.nullable(),
    sql`
      WITH c AS (
        SELECT c.*,
          CASE
            WHEN c.owner_id = ${userId} THEN 'owner'
            WHEN EXISTS (
              SELECT 1 FROM community_member m WHERE m.community_id = c.id AND m.user_id = ${userId}
            ) THEN 'member'
            WHEN EXISTS (
              SELECT 1 FROM join_request jr WHERE jr.community_id = c.id AND jr.user_id = ${userId}
            ) THEN 'requested'
            ELSE 'none'
          END AS membership
        FROM community c
        WHERE c.slug = ${slug}
      )
      SELECT (
        SELECT json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'description', c.description,
          'access', c.access,
          'createdAt', c.created_at,
          'owner', json_build_object('id', u.id, 'name', u.name, 'image', u.image),
          'membership', c.membership,
          'memberCount', ${memberCount},
          'noteCount', ${noteCount}
        )
        FROM c
        JOIN "user" u ON u.id = c.owner_id
        WHERE c.access <> 'private' OR c.membership IN ('owner', 'member')
      ) AS result
    `,
  );
}

/** Open → member row. Request → join_request row. Private or missing → null. */
export function joinCommunity(userId: string, slug: string) {
  return queryJson(
    joinResultSchema.nullable(),
    sql`
      WITH c AS (
        SELECT id, access FROM community WHERE slug = ${slug} AND access <> 'private'
      ), is_member AS (
        SELECT 1 FROM community_member m JOIN c ON m.community_id = c.id WHERE m.user_id = ${userId}
      ), joined AS (
        INSERT INTO community_member (community_id, user_id)
        SELECT id, ${userId} FROM c WHERE access = 'open'
        ON CONFLICT DO NOTHING
      ), requested AS (
        INSERT INTO join_request (community_id, user_id)
        SELECT id, ${userId} FROM c WHERE access = 'request' AND NOT EXISTS (SELECT 1 FROM is_member)
        ON CONFLICT DO NOTHING
      )
      SELECT (
        SELECT json_build_object(
          'status',
          CASE WHEN access = 'open' OR EXISTS (SELECT 1 FROM is_member) THEN 'joined' ELSE 'requested' END
        )
        FROM c
      ) AS result
    `,
  );
}

const leaveResultSchema = z.enum(["left", "owner", "not_member"]);

/** The owner can't leave until ownership is transferred. */
export function leaveCommunity(userId: string, slug: string) {
  return queryJson(
    leaveResultSchema,
    sql`
      WITH c AS (
        SELECT id, owner_id FROM community WHERE slug = ${slug}
      ), deleted AS (
        DELETE FROM community_member m
        USING c
        WHERE m.community_id = c.id AND m.user_id = ${userId} AND c.owner_id <> ${userId}
        RETURNING m.user_id
      )
      SELECT CASE
        WHEN EXISTS (SELECT 1 FROM c WHERE owner_id = ${userId}) THEN 'owner'
        WHEN EXISTS (SELECT 1 FROM deleted) THEN 'left'
        ELSE 'not_member'
      END AS result
    `,
  );
}

/** Owner-only edit. Switching to open drops pending requests, since anyone can now join. False when not the owner. */
export function updateCommunity(userId: string, slug: string, input: UpdateCommunityInput) {
  return queryJson(
    z.boolean(),
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)}),
      upd AS (
        UPDATE community c SET
          name = ${input.name},
          description = nullif(${input.description ?? ""}, ''),
          access = ${input.access}
        FROM owned o
        WHERE c.id = o.id
        RETURNING c.id, c.access
      ),
      cleared AS (
        DELETE FROM join_request jr USING upd
        WHERE jr.community_id = upd.id AND upd.access = 'open'
      )
      SELECT EXISTS (SELECT 1 FROM upd) AS result
    `,
  );
}
