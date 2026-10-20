import { z } from "zod";

export const userSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
});
export type UserSummary = z.infer<typeof userSummarySchema>;
export const userSummaryListSchema = z.array(userSummarySchema);

export const memberSchema = userSummarySchema.extend({
  joinedAt: z.string(),
  isOwner: z.boolean(),
});
export type Member = z.infer<typeof memberSchema>;

export const joinRequestSchema = userSummarySchema.extend({ requestedAt: z.string() });
export type JoinRequest = z.infer<typeof joinRequestSchema>;

export const userParamsSchema = z.object({ slug: z.string().min(1), userId: z.string().min(1) });

export const userSearchQuerySchema = z.object({
  q: z.string().trim().min(2).max(100),
  community: z.string().min(1),
});

export const addMemberSchema = z.object({ email: z.email() });
export const transferOwnershipSchema = z.object({ userId: z.string().min(1) });
export const resolveRequestSchema = z.object({ action: z.enum(["approve", "reject"]) });
export type ResolveRequestAction = z.infer<typeof resolveRequestSchema>["action"];
