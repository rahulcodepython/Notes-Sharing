import "server-only";
import { sql } from "drizzle-orm";
import { z } from "zod";
import {
  acceptInviteSchema,
  INVITE_TTL_DAYS,
  inviteLinkSchema,
  invitePreviewSchema,
} from "@/schemas/invite";
import { queryJson } from "../query";
import { ownedCommunity } from "./owned";

/** Creates or replaces the community's single invite link. Null when not the owner. */
export function regenerateInvite(userId: string, slug: string, token: string) {
  return queryJson(
    inviteLinkSchema.nullable(),
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)}),
      up AS (
        INSERT INTO invitation (community_id, token, created_by, expires_at)
        SELECT id, ${token}, ${userId}, now() + make_interval(days => ${INVITE_TTL_DAYS})
        FROM owned
        ON CONFLICT (community_id) DO UPDATE SET
          token = excluded.token,
          created_by = excluded.created_by,
          expires_at = excluded.expires_at,
          created_at = now()
        RETURNING token, expires_at
      )
      SELECT (SELECT json_build_object('token', token, 'expiresAt', expires_at) FROM up) AS result
    `,
  );
}

/** False when not the owner. */
export function revokeInvite(userId: string, slug: string) {
  return queryJson(
    z.boolean(),
    sql`
      WITH owned AS (${ownedCommunity(userId, slug)}),
      del AS (DELETE FROM invitation i USING owned o WHERE i.community_id = o.id)
      SELECT EXISTS (SELECT 1 FROM owned) AS result
    `,
  );
}

const validInvite = (token: string) => sql`
  SELECT c.* FROM invitation i JOIN community c ON c.id = i.community_id
  WHERE i.token = ${token} AND i.expires_at > now()
`;

/** Null when the token is unknown or expired. */
export function getInvitePreview(userId: string, token: string) {
  return queryJson(
    invitePreviewSchema.nullable(),
    sql`
      WITH c AS (${validInvite(token)})
      SELECT (
        SELECT json_build_object(
          'name', c.name,
          'slug', c.slug,
          'description', c.description,
          'memberCount', (SELECT count(*) FROM community_member cm WHERE cm.community_id = c.id),
          'isMember', EXISTS (
            SELECT 1 FROM community_member m WHERE m.community_id = c.id AND m.user_id = ${userId}
          )
        )
        FROM c
      ) AS result
    `,
  );
}

/** Joins via the link. Null when the token is unknown or expired. */
export function acceptInvite(userId: string, token: string) {
  return queryJson(
    acceptInviteSchema.nullable(),
    sql`
      WITH c AS (${validInvite(token)}),
      ins AS (
        INSERT INTO community_member (community_id, user_id)
        SELECT id, ${userId} FROM c
        ON CONFLICT DO NOTHING
      ),
      cleared AS (
        DELETE FROM join_request jr USING c WHERE jr.community_id = c.id AND jr.user_id = ${userId}
      )
      SELECT (SELECT json_build_object('slug', slug) FROM c) AS result
    `,
  );
}
