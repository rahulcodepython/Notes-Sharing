"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api/client";
import {
  communityDetailSchema,
  exploreCommunityListSchema,
  joinResultSchema,
  myCommunityListSchema,
  myCommunitySchema,
  okSchema,
  type CreateCommunityInput,
} from "@/schemas/community";

export const communityKeys = {
  all: ["communities"] as const,
  mine: ["communities", "mine"] as const,
  explore: (q: string) => ["communities", "explore", q] as const,
  detail: (slug: string) => ["communities", "detail", slug] as const,
};

export function useMyCommunities() {
  return useQuery({
    queryKey: communityKeys.mine,
    queryFn: () => api("/api/communities", myCommunityListSchema),
  });
}

/** The community matching the `[slug]` route param, if the user belongs to it. */
export function useCurrentCommunity() {
  const params = useParams<{ slug?: string }>();
  const { data } = useMyCommunities();
  return params.slug ? data?.find((c) => c.slug === params.slug) : undefined;
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: communityKeys.detail(slug),
    queryFn: () => api(`/api/communities/${slug}`, communityDetailSchema),
    retry: false,
  });
}

export function useExploreCommunities(q: string) {
  return useQuery({
    queryKey: communityKeys.explore(q),
    queryFn: () =>
      api(`/api/communities/explore?${new URLSearchParams({ q })}`, exploreCommunityListSchema),
  });
}

/** Mutations touch membership, so they refresh every community query. */
function useInvalidateCommunities() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: communityKeys.all });
}

export function useCreateCommunity() {
  const invalidate = useInvalidateCommunities();
  return useMutation({
    mutationFn: (input: CreateCommunityInput) =>
      api("/api/communities", myCommunitySchema, { method: "POST", body: input }),
    onSuccess: invalidate,
  });
}

export function useJoinCommunity() {
  const invalidate = useInvalidateCommunities();
  return useMutation({
    mutationFn: (slug: string) =>
      api(`/api/communities/${slug}/join`, joinResultSchema, { method: "POST" }),
    onSuccess: invalidate,
  });
}

export function useLeaveCommunity() {
  const invalidate = useInvalidateCommunities();
  return useMutation({
    mutationFn: (slug: string) =>
      api(`/api/communities/${slug}/leave`, okSchema, { method: "POST" }),
    onSuccess: invalidate,
  });
}
