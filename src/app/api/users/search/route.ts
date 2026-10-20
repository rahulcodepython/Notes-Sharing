import { searchUsers } from "@/db/queries/member";
import { notOwner } from "@/lib/api/errors";
import { parseQuery, route } from "@/lib/api/handler";
import { userSearchQuerySchema, userSummaryListSchema } from "@/schemas/member";

export const GET = route(userSummaryListSchema, async ({ req, user }) => {
  const { q, community } = parseQuery(req, userSearchQuerySchema);
  const users = await searchUsers(user.id, community, q);
  if (!users) throw notOwner();
  return users;
});
