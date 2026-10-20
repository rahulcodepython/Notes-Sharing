import { z } from "zod";

export const accountSchema = z.object({
  profile: z.object({
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
    createdAt: z.string(),
  }),
  stats: z.object({
    created: z.number().int(),
    joined: z.number().int(),
    uploads: z.number().int(),
  }),
  /** Communities the user belongs to or has uploaded to, with their upload count in each. */
  communities: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      slug: z.string(),
      isOwner: z.boolean(),
      isMember: z.boolean(),
      uploads: z.number().int(),
    }),
  ),
});
export type Account = z.infer<typeof accountSchema>;
export type AccountCommunity = Account["communities"][number];

export const deleteAccountSchema = z.object({ email: z.email() });
