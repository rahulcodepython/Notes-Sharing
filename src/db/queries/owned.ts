import "server-only";
import { sql } from "drizzle-orm";

/** CTE body selecting the community only when `userId` owns it. Use as `WITH owned AS (${ownedCommunity(...)})`. */
export function ownedCommunity(userId: string, slug: string) {
  return sql`SELECT * FROM community WHERE slug = ${slug} AND owner_id = ${userId}`;
}
