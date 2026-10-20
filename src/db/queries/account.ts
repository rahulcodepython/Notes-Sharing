import "server-only";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { accountSchema } from "@/schemas/account";
import { queryJson } from "../query";

/** Profile, counts and per-community uploads for the account page in one statement. */
export function getAccount(userId: string) {
  return queryJson(
    accountSchema,
    sql`
      WITH rows AS (
        SELECT c.id, c.name, c.slug,
          c.owner_id = ${userId} AS is_owner,
          EXISTS (
            SELECT 1 FROM community_member m WHERE m.community_id = c.id AND m.user_id = ${userId}
          ) AS is_member,
          count(n.id) AS uploads
        FROM community c
        LEFT JOIN note n ON n.community_id = c.id AND n.uploader_id = ${userId}
        GROUP BY c.id
      ), mine AS (
        SELECT * FROM rows WHERE is_member OR uploads > 0
      )
      SELECT json_build_object(
        'profile', (
          SELECT json_build_object('name', name, 'email', email, 'image', image, 'createdAt', created_at)
          FROM "user" WHERE id = ${userId}
        ),
        'stats', json_build_object(
          'created', (SELECT count(*) FROM mine WHERE is_owner),
          'joined', (SELECT count(*) FROM mine WHERE is_member),
          'uploads', (SELECT coalesce(sum(uploads), 0) FROM mine)
        ),
        'communities', (
          SELECT coalesce(
            json_agg(
              json_build_object(
                'id', id, 'name', name, 'slug', slug,
                'isOwner', is_owner, 'isMember', is_member, 'uploads', uploads
              )
              ORDER BY is_owner DESC, uploads DESC, name
            ),
            '[]'
          )
          FROM mine
        )
      ) AS result
    `,
  );
}

const deleteAccountResultSchema = z.enum(["deleted", "email_mismatch", "owns_communities"]);

/**
 * Deletes the user. Cascades remove sessions, Google account link, memberships, requests,
 * their notes and download history. Refused while they still own a community.
 */
export function deleteAccount(userId: string, email: string) {
  return queryJson(
    deleteAccountResultSchema,
    sql`
      WITH u AS (
        SELECT id FROM "user" WHERE id = ${userId} AND lower(email) = lower(${email})
      ), owns AS (
        SELECT 1 FROM community WHERE owner_id = ${userId}
      ), del AS (
        DELETE FROM "user"
        WHERE id IN (SELECT id FROM u) AND NOT EXISTS (SELECT 1 FROM owns)
        RETURNING id
      )
      SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM u) THEN 'email_mismatch'
        WHEN EXISTS (SELECT 1 FROM owns) THEN 'owns_communities'
        ELSE 'deleted'
      END AS result
    `,
  );
}
