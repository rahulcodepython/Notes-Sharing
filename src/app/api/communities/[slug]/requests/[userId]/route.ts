import { resolveJoinRequest } from "@/db/queries/member";
import { ApiError, notOwner } from "@/lib/api/errors";
import { parseBody, parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import { resolveRequestSchema, userParamsSchema } from "@/schemas/member";

export const POST = route(okSchema, async ({ req, ctx, user }) => {
  const { slug, userId } = await parseParams(ctx, userParamsSchema);
  const { action } = await parseBody(req, resolveRequestSchema);
  const result = await resolveJoinRequest(user.id, slug, userId, action === "approve");
  if (result === "not_owner") throw notOwner();
  if (result === "not_found") throw new ApiError(404, "Request not found");
  return { ok: true };
});
