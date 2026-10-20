"use client";

import { ShieldXIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/common/empty-state";
import { DetailsCard } from "@/components/community/settings/details-card";
import { InviteCard } from "@/components/community/settings/invite-card";
import { MembersCard } from "@/components/community/settings/members-card";
import { RequestsCard } from "@/components/community/settings/requests-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunitySettings } from "@/hooks/queries/use-community-settings";

export function SettingsView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: settings, isPending, isError } = useCommunitySettings(slug);

  if (isPending) return <Skeleton className="h-64 rounded-xl" />;
  if (isError) {
    return (
      <EmptyState
        icon={<ShieldXIcon />}
        title="Only the owner can manage this community"
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <DetailsCard slug={slug} details={settings.details} />
      <MembersCard slug={slug} members={settings.members} />
      <RequestsCard slug={slug} requests={settings.requests} />
      <InviteCard slug={slug} invite={settings.invite} />
    </div>
  );
}
