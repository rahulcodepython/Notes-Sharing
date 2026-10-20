import { listMyCommunities } from "@/db/queries/community";
import { route } from "@/lib/api/handler";
import { myCommunityListSchema } from "@/schemas/community";

export const GET = route(myCommunityListSchema, ({ user }) => listMyCommunities(user.id));
