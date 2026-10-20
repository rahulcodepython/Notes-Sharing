import { z } from "zod";

export const communityAccessSchema = z.enum(["open", "request", "private"]);
export type CommunityAccess = z.infer<typeof communityAccessSchema>;

export const myCommunitySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  access: communityAccessSchema,
  isOwner: z.boolean(),
  memberCount: z.number().int(),
  noteCount: z.number().int(),
});
export type MyCommunity = z.infer<typeof myCommunitySchema>;

export const myCommunityListSchema = z.array(myCommunitySchema);
