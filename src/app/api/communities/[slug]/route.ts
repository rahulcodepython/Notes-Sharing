import { getCommunity } from "@/db/queries/community";
import { ApiError } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { communityDetailSchema, slugParamsSchema } from "@/schemas/community";

export const GET = route(communityDetailSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const community = await getCommunity(user.id, slug);
  if (!community) throw new ApiError(404, "Community not found");
  return community;
});
