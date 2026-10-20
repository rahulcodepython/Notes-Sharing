import { getCommunitySettings } from "@/db/queries/member";
import { notOwner } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { communitySettingsSchema, slugParamsSchema } from "@/schemas/community";

export const GET = route(communitySettingsSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const settings = await getCommunitySettings(user.id, slug);
  if (!settings) throw notOwner();
  return settings;
});
