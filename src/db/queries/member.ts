import "server-only";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { communitySettingsSchema } from "@/schemas/community";
import { userSummaryListSchema } from "@/schemas/member";
import { likeEscape, queryJson } from "../query";
import { ownedCommunity } from "./owned";

const userJson = sql.raw(
  `json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'image', u.image)`,
);

/** Everything the owner's settings page needs, in one statement. Null when not the owner. */
export function getCommunitySettings(userId: string, slug: string) {
  return queryJson(
    communitySettingsSchema.nullable(),
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)})
      SELECT (
        SELECT json_build_object(
          'details', json_build_object('name', o.name, 'description', o.description, 'access', o.access),
          'members', (
            SELECT coalesce(
              json_agg(
                ${userJson}::jsonb || jsonb_build_object('joinedAt', m.joined_at, 'isOwner', u.id = o.owner_id)
                ORDER BY u.id = o.owner_id DESC, m.joined_at
              ),
              '[]'
            )
            FROM community_member m JOIN "user" u ON u.id = m.user_id
            WHERE m.community_id = o.id
          ),
          'requests', (
            SELECT coalesce(
              json_agg(${userJson}::jsonb || jsonb_build_object('requestedAt', jr.created_at) ORDER BY jr.created_at),
              '[]'
            )
            FROM join_request jr JOIN "user" u ON u.id = jr.user_id
            WHERE jr.community_id = o.id
          ),
          'invite', (
            SELECT json_build_object('token', i.token, 'expiresAt', i.expires_at)
            FROM invitation i
            WHERE i.community_id = o.id AND i.expires_at > now()
          )
        )
        FROM owned o
      ) AS result
    `,
  );
}

/** Users matching an email prefix or name, who are not yet members. Null when not the owner. */
export function searchUsers(userId: string, slug: string, q: string) {
  const escaped = likeEscape(q);
  return queryJson(
    userSummaryListSchema.nullable(),
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)})
      SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM owned) THEN NULL ELSE (
        SELECT coalesce(json_agg(${userJson}), '[]')
        FROM (
          SELECT u.* FROM "user" u
          WHERE (u.email ILIKE ${escaped + "%"} OR u.name ILIKE ${"%" + escaped + "%"})
            AND NOT EXISTS (
              SELECT 1 FROM community_member m JOIN owned o ON m.community_id = o.id
              WHERE m.user_id = u.id
            )
          ORDER BY u.email
          LIMIT 5
        ) u
      ) END AS result
    `,
  );
}

const addMemberResultSchema = z.enum(["added", "not_owner", "not_found", "already_member"]);

/** Adds an existing user by email. Clears any pending join request of that user. */
export function addMember(userId: string, slug: string, email: string) {
  return queryJson(
    addMemberResultSchema,
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)}),
      target AS (SELECT id FROM "user" WHERE lower(email) = lower(${email})),
      ins AS (
        INSERT INTO community_member (community_id, user_id)
        SELECT o.id, t.id FROM owned o, target t
        ON CONFLICT DO NOTHING
        RETURNING user_id
      ),
      cleared AS (
        DELETE FROM join_request jr USING owned o, target t
        WHERE jr.community_id = o.id AND jr.user_id = t.id
      )
      SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM owned) THEN 'not_owner'
        WHEN NOT EXISTS (SELECT 1 FROM target) THEN 'not_found'
        WHEN EXISTS (SELECT 1 FROM ins) THEN 'added'
        ELSE 'already_member'
      END AS result
    `,
  );
}

const removeMemberResultSchema = z.enum(["removed", "not_owner", "not_member", "is_owner"]);

/** The member's notes stay in the community. */
export function removeMember(userId: string, slug: string, targetId: string) {
  return queryJson(
    removeMemberResultSchema,
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)}),
      del AS (
        DELETE FROM community_member m USING owned o
        WHERE m.community_id = o.id AND m.user_id = ${targetId} AND m.user_id <> o.owner_id
        RETURNING m.user_id
      )
      SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM owned) THEN 'not_owner'
        WHEN ${targetId} = ${userId} THEN 'is_owner'
        WHEN EXISTS (SELECT 1 FROM del) THEN 'removed'
        ELSE 'not_member'
      END AS result
    `,
  );
}

const resolveRequestResultSchema = z.enum(["done", "not_owner", "not_found"]);

/** Approve adds the member; both actions remove the request. */
export function resolveJoinRequest(userId: string, slug: string, targetId: string, approve: boolean) {
  return queryJson(
    resolveRequestResultSchema,
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)}),
      req AS (
        DELETE FROM join_request jr USING owned o
        WHERE jr.community_id = o.id AND jr.user_id = ${targetId}
        RETURNING jr.community_id, jr.user_id
      ),
      ins AS (
        INSERT INTO community_member (community_id, user_id)
        SELECT community_id, user_id FROM req WHERE ${approve}::boolean
        ON CONFLICT DO NOTHING
      )
      SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM owned) THEN 'not_owner'
        WHEN EXISTS (SELECT 1 FROM req) THEN 'done'
        ELSE 'not_found'
      END AS result
    `,
  );
}

const transferResultSchema = z.enum(["done", "not_owner", "not_member", "self"]);

/** Hands ownership to another member. The old owner stays a member. */
export function transferOwnership(userId: string, slug: string, targetId: string) {
  return queryJson(
    transferResultSchema,
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)}),
      target AS (
        SELECT m.user_id FROM community_member m JOIN owned o ON m.community_id = o.id
        WHERE m.user_id = ${targetId} AND m.user_id <> ${userId}
      ),
      upd AS (
        UPDATE community c SET owner_id = t.user_id
        FROM target t, owned o
        WHERE c.id = o.id
        RETURNING c.id
      )
      SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM owned) THEN 'not_owner'
        WHEN ${targetId} = ${userId} THEN 'self'
        WHEN EXISTS (SELECT 1 FROM upd) THEN 'done'
        ELSE 'not_member'
      END AS result
    `,
  );
}
