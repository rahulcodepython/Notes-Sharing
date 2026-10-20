import { transferOwnership } from "@/db/queries/member";
import { ApiError, notOwner } from "@/lib/api/errors";
import { parseBody, parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import { slugParamsSchema } from "@/schemas/community";
import { transferOwnershipSchema } from "@/schemas/member";

export const POST = route(okSchema, async ({ req, ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const { userId } = await parseBody(req, transferOwnershipSchema);
  const result = await transferOwnership(user.id, slug, userId);
  if (result === "not_owner") throw notOwner();
  if (result === "self") throw new ApiError(400, "You already own this community");
  if (result === "not_member") throw new ApiError(404, "New owner must be a member");
  return { ok: true };
});
