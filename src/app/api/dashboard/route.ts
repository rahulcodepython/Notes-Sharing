import { getDashboard } from "@/db/queries/dashboard";
import { route } from "@/lib/api/handler";
import { dashboardSchema } from "@/schemas/dashboard";

export const GET = route(dashboardSchema, ({ user }) => getDashboard(user.id));
