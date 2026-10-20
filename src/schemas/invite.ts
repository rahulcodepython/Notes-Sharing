import { z } from "zod";

export const INVITE_TTL_DAYS = 7;

export const inviteLinkSchema = z.object({ token: z.string(), expiresAt: z.string() });
export type InviteLink = z.infer<typeof inviteLinkSchema>;

export const tokenParamsSchema = z.object({ token: z.string().min(1) });

export const invitePreviewSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  memberCount: z.number().int(),
  isMember: z.boolean(),
});
export type InvitePreview = z.infer<typeof invitePreviewSchema>;

export const acceptInviteSchema = z.object({ slug: z.string() });
