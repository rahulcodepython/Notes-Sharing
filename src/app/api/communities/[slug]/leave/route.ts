import { leaveCommunity } from "@/db/queries/community";
import { ApiError } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import { slugParamsSchema } from "@/schemas/community";

export const POST = route(okSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const result = await leaveCommunity(user.id, slug);
  if (result === "owner") throw new ApiError(409, "Transfer ownership before leaving");
  if (result === "not_member") throw new ApiError(404, "You are not a member of this community");
  return { ok: true };
});
