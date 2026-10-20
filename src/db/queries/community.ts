import "server-only";
import { sql } from "drizzle-orm";
import { myCommunityListSchema } from "@/schemas/community";
import { queryJson } from "../query";

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
            'memberCount', (SELECT count(*) FROM community_member cm WHERE cm.community_id = c.id),
            'noteCount', (SELECT count(*) FROM note n WHERE n.community_id = c.id)
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
