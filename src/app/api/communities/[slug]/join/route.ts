import { joinCommunity } from "@/db/queries/community";
import { ApiError } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { joinResultSchema, slugParamsSchema } from "@/schemas/community";

export const POST = route(joinResultSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const result = await joinCommunity(user.id, slug);
  if (!result) throw new ApiError(404, "Community not found");
  return result;
});
