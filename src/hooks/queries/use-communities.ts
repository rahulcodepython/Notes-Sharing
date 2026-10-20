"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { myCommunityListSchema } from "@/schemas/community";

export const communityKeys = {
  mine: ["communities", "mine"] as const,
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
