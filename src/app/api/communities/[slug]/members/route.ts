import { addMember } from "@/db/queries/member";
import { ApiError, notOwner } from "@/lib/api/errors";
import { parseBody, parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import { slugParamsSchema } from "@/schemas/community";
import { addMemberSchema } from "@/schemas/member";

export const POST = route(okSchema, async ({ req, ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const { email } = await parseBody(req, addMemberSchema);
  const result = await addMember(user.id, slug, email);
  if (result === "not_owner") throw notOwner();
  if (result === "not_found") throw new ApiError(404, "No user with that email has signed up yet");
  if (result === "already_member") throw new ApiError(409, "Already a member");
  return { ok: true };
});
