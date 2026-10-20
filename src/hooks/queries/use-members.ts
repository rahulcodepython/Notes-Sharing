"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { okSchema } from "@/schemas/common";
import type { UpdateCommunityInput } from "@/schemas/community";
import { inviteLinkSchema } from "@/schemas/invite";
import {
  communityMembersSchema,
  userSummaryListSchema,
  type ResolveRequestAction,
} from "@/schemas/member";
import { communityKeys } from "./use-communities";

const membersKey = (slug: string) => [...communityKeys.all, "members", slug] as const;

export function useCommunityMembers(slug: string) {
  return useQuery({
    queryKey: membersKey(slug),
    queryFn: () => api(`/api/communities/${slug}/members`, communityMembersSchema),
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

/** Every owner action can affect counts, membership or ownership, so refresh all community data. */
function useOwnerMutation<V, R>(mutationFn: (vars: V) => Promise<R>) {
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
  return useOwnerMutation((input: UpdateCommunityInput) =>
    api(`/api/communities/${slug}`, okSchema, { method: "PATCH", body: input }),
  );
}

export function useAddMember(slug: string) {
  return useOwnerMutation((email: string) =>
    api(`/api/communities/${slug}/members`, okSchema, { method: "POST", body: { email } }),
  );
}

export function useRemoveMember(slug: string) {
  return useOwnerMutation((userId: string) =>
    api(`/api/communities/${slug}/members/${userId}`, okSchema, { method: "DELETE" }),
  );
}

export function useResolveRequest(slug: string) {
  return useOwnerMutation(({ userId, action }: { userId: string; action: ResolveRequestAction }) =>
    api(`/api/communities/${slug}/requests/${userId}`, okSchema, {
      method: "POST",
      body: { action },
    }),
  );
}

export function useTransferOwnership(slug: string) {
  return useOwnerMutation((userId: string) =>
    api(`/api/communities/${slug}/transfer`, okSchema, { method: "POST", body: { userId } }),
  );
}

export function useRegenerateInvite(slug: string) {
  return useOwnerMutation(() =>
    api(`/api/communities/${slug}/invite`, inviteLinkSchema, { method: "POST" }),
  );
}

export function useRevokeInvite(slug: string) {
  return useOwnerMutation(() =>
    api(`/api/communities/${slug}/invite`, okSchema, { method: "DELETE" }),
  );
}

export function useDeleteCommunity(slug: string) {
  return useOwnerMutation(() => api(`/api/communities/${slug}`, okSchema, { method: "DELETE" }));
}
