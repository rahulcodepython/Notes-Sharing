import { z } from "zod";

export const dashboardSchema = z.object({
  stats: z.object({
    communities: z.number().int(),
    members: z.number().int(),
    notes: z.number().int(),
    downloads: z.number().int(),
  }),
  /** Last 30 days, oldest first, one row per day (UTC). */
  activity: z.array(
    z.object({ date: z.string(), notes: z.number().int(), downloads: z.number().int() }),
  ),
  /** Top categories by note count. Names repeat across communities, so the community is included. */
  categories: z.array(
    z.object({ id: z.uuid(), name: z.string(), community: z.string(), notes: z.number().int() }),
  ),
  topUploaders: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      image: z.string().nullable(),
      notes: z.number().int(),
    }),
  ),
});
export type Dashboard = z.infer<typeof dashboardSchema>;
