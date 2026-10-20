import { z } from "zod";
import { inviteLinkSchema } from "./invite";
import { joinRequestSchema, memberSchema } from "./member";

export const communityAccessSchema = z.enum(["open", "request", "private"]);
export type CommunityAccess = z.infer<typeof communityAccessSchema>;

export const communityAccessOptions: { value: CommunityAccess; label: string; description: string }[] = [
  { value: "open", label: "Open", description: "Public. Anyone can join with one click." },
  { value: "request", label: "Request", description: "Public. You approve each join request." },
  { value: "private", label: "Private", description: "Hidden. Invite only." },
];

export const slugParamsSchema = z.object({ slug: z.string().min(1) });

// requests

export const createCommunitySchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(60),
  description: z.string().trim().max(300).optional(),
  access: communityAccessSchema,
});
export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;

export const exploreQuerySchema = z.object({ q: z.string().trim().max(60).optional() });

// responses

const countsSchema = z.object({
  memberCount: z.number().int(),
  noteCount: z.number().int(),
});

export const myCommunitySchema = countsSchema.extend({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  access: communityAccessSchema,
  isOwner: z.boolean(),
});
export type MyCommunity = z.infer<typeof myCommunitySchema>;
export const myCommunityListSchema = z.array(myCommunitySchema);

export const exploreCommunitySchema = countsSchema.extend({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  access: z.enum(["open", "request"]),
  requested: z.boolean(),
});
export type ExploreCommunity = z.infer<typeof exploreCommunitySchema>;
export const exploreCommunityListSchema = z.array(exploreCommunitySchema);

export const membershipSchema = z.enum(["owner", "member", "requested", "none"]);
export type Membership = z.infer<typeof membershipSchema>;

export const communityDetailSchema = countsSchema.extend({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  access: communityAccessSchema,
  createdAt: z.string(),
  owner: z.object({ id: z.string(), name: z.string(), image: z.string().nullable() }),
  membership: membershipSchema,
});
export type CommunityDetail = z.infer<typeof communityDetailSchema>;

export const joinResultSchema = z.object({ status: z.enum(["joined", "requested"]) });

export const updateCommunitySchema = createCommunitySchema;
export type UpdateCommunityInput = CreateCommunityInput;

export const communitySettingsSchema = z.object({
  details: z.object({
    name: z.string(),
    description: z.string().nullable(),
    access: communityAccessSchema,
  }),
  members: z.array(memberSchema),
  requests: z.array(joinRequestSchema),
  invite: inviteLinkSchema.nullable(),
});
export type CommunitySettings = z.infer<typeof communitySettingsSchema>;
