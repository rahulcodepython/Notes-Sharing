import "server-only";
import { sql } from "drizzle-orm";
import { dashboardSchema } from "@/schemas/dashboard";
import { queryJson } from "../query";

/** All dashboard data across the user's communities in one statement. */
export function getDashboard(userId: string) {
  return queryJson(
    dashboardSchema,
    sql`
      WITH my AS (
        SELECT community_id FROM community_member WHERE user_id = ${userId}
      ), n AS (
        SELECT n.* FROM note n JOIN my USING (community_id)
      ), dl AS (
        SELECT d.* FROM note_download d JOIN n ON n.id = d.note_id
      ), days AS (
        SELECT generate_series(current_date - 29, current_date, interval '1 day')::date AS day
      )
      SELECT json_build_object(
        'stats', json_build_object(
          'communities', (SELECT count(*) FROM my),
          'members', (
            SELECT count(DISTINCT m.user_id) FROM community_member m JOIN my USING (community_id)
          ),
          'notes', (SELECT count(*) FROM n),
          'downloads', (SELECT count(*) FROM dl)
        ),
        'activity', (
          SELECT json_agg(
            json_build_object(
              'date', d.day,
              'notes', (SELECT count(*) FROM n WHERE n.created_at::date = d.day),
              'downloads', (SELECT count(*) FROM dl WHERE dl.created_at::date = d.day)
            )
            ORDER BY d.day
          )
          FROM days d
        ),
        'categories', (
          SELECT coalesce(
            json_agg(
              json_build_object('id', x.id, 'name', x.name, 'community', x.community, 'notes', x.notes)
              ORDER BY x.notes DESC, x.name
            ),
            '[]'
          )
          FROM (
            SELECT k.id, k.name, c.name AS community, count(*) AS notes
            FROM n
            JOIN category k ON k.id = n.category_id
            JOIN community c ON c.id = n.community_id
            GROUP BY k.id, k.name, c.name
            ORDER BY notes DESC, k.name
            LIMIT 8
          ) x
        ),
        'topUploaders', (
          SELECT coalesce(
            json_agg(
              json_build_object(
                'id', x.id, 'name', x.name, 'email', x.email, 'image', x.image, 'notes', x.notes
              )
              ORDER BY x.notes DESC, x.name
            ),
            '[]'
          )
          FROM (
            SELECT u.id, u.name, u.email, u.image, count(*) AS notes
            FROM n JOIN "user" u ON u.id = n.uploader_id
            GROUP BY u.id
            ORDER BY notes DESC, u.name
            LIMIT 5
          ) x
        )
      ) AS result
    `,
  );
}
