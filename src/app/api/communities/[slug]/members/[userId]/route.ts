import { removeMember } from "@/db/queries/member";
import { ApiError, notOwner } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import { userParamsSchema } from "@/schemas/member";

export const DELETE = route(okSchema, async ({ ctx, user }) => {
  const { slug, userId } = await parseParams(ctx, userParamsSchema);
  const result = await removeMember(user.id, slug, userId);
  if (result === "not_owner") throw notOwner();
  if (result === "is_owner") throw new ApiError(409, "Transfer ownership before removing yourself");
  if (result === "not_member") throw new ApiError(404, "Not a member");
  return { ok: true };
});
