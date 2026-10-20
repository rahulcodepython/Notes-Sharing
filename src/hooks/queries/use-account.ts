"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { accountSchema } from "@/schemas/account";
import { okSchema } from "@/schemas/common";
import { communityKeys } from "./use-communities";

export function useAccount() {
  return useQuery({
    queryKey: [...communityKeys.all, "account"],
    queryFn: () => api("/api/me", accountSchema),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (email: string) => api("/api/me", okSchema, { method: "DELETE", body: { email } }),
  });
}
