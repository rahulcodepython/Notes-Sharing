import { randomBytes } from "node:crypto";
import { regenerateInvite, revokeInvite } from "@/db/queries/invite";
import { notOwner } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import { slugParamsSchema } from "@/schemas/community";
import { inviteLinkSchema } from "@/schemas/invite";

/** Creates a new link; the previous one stops working. */
export const POST = route(inviteLinkSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const invite = await regenerateInvite(user.id, slug, randomBytes(24).toString("base64url"));
  if (!invite) throw notOwner();
  return invite;
});

export const DELETE = route(okSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  if (!(await revokeInvite(user.id, slug))) throw notOwner();
  return { ok: true };
});
