"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { okSchema } from "@/schemas/common";
import { communitySettingsSchema, type UpdateCommunityInput } from "@/schemas/community";
import { inviteLinkSchema } from "@/schemas/invite";
import { userSummaryListSchema, type ResolveRequestAction } from "@/schemas/member";
import { communityKeys } from "./use-communities";

const settingsKey = (slug: string) => [...communityKeys.all, "settings", slug] as const;

export function useCommunitySettings(slug: string) {
  return useQuery({
    queryKey: settingsKey(slug),
    queryFn: () => api(`/api/communities/${slug}/settings`, communitySettingsSchema),
    retry: false,
  });
}

export function useUserSearch(slug: string, q: string) {
  return useQuery({
    queryKey: ["users", "search", slug, q],
    queryFn: () =>
      api(
        `/api/users/search?${new URLSearchParams({ q, community: slug })}`,
        userSummaryListSchema,
      ),
    enabled: q.length >= 2,
  });
}

/** Every settings change can affect counts, membership or ownership, so refresh all community data. */
function useSettingsMutation<V, R>(mutationFn: (vars: V) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: communityKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["users", "search"] }),
      ]),
  });
}

export function useUpdateCommunity(slug: string) {
  return useSettingsMutation((input: UpdateCommunityInput) =>
    api(`/api/communities/${slug}`, okSchema, { method: "PATCH", body: input }),
  );
}

export function useAddMember(slug: string) {
  return useSettingsMutation((email: string) =>
    api(`/api/communities/${slug}/members`, okSchema, { method: "POST", body: { email } }),
  );
}

export function useRemoveMember(slug: string) {
  return useSettingsMutation((userId: string) =>
    api(`/api/communities/${slug}/members/${userId}`, okSchema, { method: "DELETE" }),
  );
}

export function useResolveRequest(slug: string) {
  return useSettingsMutation(({ userId, action }: { userId: string; action: ResolveRequestAction }) =>
    api(`/api/communities/${slug}/requests/${userId}`, okSchema, {
      method: "POST",
      body: { action },
    }),
  );
}

export function useTransferOwnership(slug: string) {
  return useSettingsMutation((userId: string) =>
    api(`/api/communities/${slug}/transfer`, okSchema, { method: "POST", body: { userId } }),
  );
}

export function useRegenerateInvite(slug: string) {
  return useSettingsMutation(() =>
    api(`/api/communities/${slug}/invite`, inviteLinkSchema, { method: "POST" }),
  );
}

export function useRevokeInvite(slug: string) {
  return useSettingsMutation(() =>
    api(`/api/communities/${slug}/invite`, okSchema, { method: "DELETE" }),
  );
}
