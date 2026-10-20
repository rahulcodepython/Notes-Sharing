import { createCommunity, listMyCommunities } from "@/db/queries/community";
import { parseBody, route } from "@/lib/api/handler";
import { slugify } from "@/lib/slug";
import {
  createCommunitySchema,
  myCommunityListSchema,
  myCommunitySchema,
} from "@/schemas/community";

export const GET = route(myCommunityListSchema, ({ user }) => listMyCommunities(user.id));

export const POST = route(myCommunitySchema, async ({ req, user }) => {
  const input = await parseBody(req, createCommunitySchema);
  return createCommunity(user.id, slugify(input.name), input);
});
