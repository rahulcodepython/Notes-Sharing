import { exploreCommunities } from "@/db/queries/community";
import { parseQuery, route } from "@/lib/api/handler";
import { exploreCommunityListSchema, exploreQuerySchema } from "@/schemas/community";

export const GET = route(exploreCommunityListSchema, ({ req, user }) => {
  const { q } = parseQuery(req, exploreQuerySchema);
  return exploreCommunities(user.id, q);
});
