import { deleteCommunity, getCommunity, updateCommunity } from "@/db/queries/community";
import { ApiError, notOwner } from "@/lib/api/errors";
import { parseBody, parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import {
  communityDetailSchema,
  slugParamsSchema,
  updateCommunitySchema,
} from "@/schemas/community";

export const GET = route(communityDetailSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const community = await getCommunity(user.id, slug);
  if (!community) throw new ApiError(404, "Community not found");
  return community;
});

export const PATCH = route(okSchema, async ({ req, ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const input = await parseBody(req, updateCommunitySchema);
  if (!(await updateCommunity(user.id, slug, input))) throw notOwner();
  return { ok: true };
});

export const DELETE = route(okSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  if (!(await deleteCommunity(user.id, slug))) throw notOwner();
  return { ok: true };
});
