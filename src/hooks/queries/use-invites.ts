"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { acceptInviteSchema, invitePreviewSchema } from "@/schemas/invite";
import { communityKeys } from "./use-communities";

export function useInvitePreview(token: string) {
  return useQuery({
    queryKey: ["invites", token],
    queryFn: () => api(`/api/invites/${token}`, invitePreviewSchema),
    retry: false,
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) =>
      api(`/api/invites/${token}`, acceptInviteSchema, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityKeys.all }),
  });
}
