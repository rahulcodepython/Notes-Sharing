import { acceptInvite, getInvitePreview } from "@/db/queries/invite";
import { ApiError } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { acceptInviteSchema, invitePreviewSchema, tokenParamsSchema } from "@/schemas/invite";

const invalid = () => new ApiError(404, "This invite link is invalid or has expired");

export const GET = route(invitePreviewSchema, async ({ ctx, user }) => {
  const { token } = await parseParams(ctx, tokenParamsSchema);
  const preview = await getInvitePreview(user.id, token);
  if (!preview) throw invalid();
  return preview;
});

export const POST = route(acceptInviteSchema, async ({ ctx, user }) => {
  const { token } = await parseParams(ctx, tokenParamsSchema);
  const result = await acceptInvite(user.id, token);
  if (!result) throw invalid();
  return result;
});
