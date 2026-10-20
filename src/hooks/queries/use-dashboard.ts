"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { dashboardSchema } from "@/schemas/dashboard";
import { communityKeys } from "./use-communities";

// Under the communities prefix so any community or note change refreshes it.
export function useDashboard() {
  return useQuery({
    queryKey: [...communityKeys.all, "dashboard"],
    queryFn: () => api("/api/dashboard", dashboardSchema),
  });
}
