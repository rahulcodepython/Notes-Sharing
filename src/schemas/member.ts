import { z } from "zod";
import { inviteLinkSchema } from "./invite";

export const userSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
});
export type UserSummary = z.infer<typeof userSummarySchema>;
export const userSummaryListSchema = z.array(userSummarySchema);

export const memberStatusSchema = z.enum(["owner", "member", "requested"]);
export type MemberStatus = z.infer<typeof memberStatusSchema>;

/** A member or a pending join request. `since` is the join date or the request date. */
export const memberRowSchema = userSummarySchema.extend({
  status: memberStatusSchema,
  since: z.string(),
  noteCount: z.number().int(),
});
export type MemberRow = z.infer<typeof memberRowSchema>;

export const userParamsSchema = z.object({ slug: z.string().min(1), userId: z.string().min(1) });

export const userSearchQuerySchema = z.object({
  q: z.string().trim().min(2).max(100),
  community: z.string().min(1),
});

export const addMemberSchema = z.object({ email: z.email() });
export const transferOwnershipSchema = z.object({ userId: z.string().min(1) });
export const resolveRequestSchema = z.object({ action: z.enum(["approve", "reject"]) });
export type ResolveRequestAction = z.infer<typeof resolveRequestSchema>["action"];

export const communityMembersSchema = z.object({
  rows: z.array(memberRowSchema),
  invite: inviteLinkSchema.nullable(),
});
export type CommunityMembers = z.infer<typeof communityMembersSchema>;
