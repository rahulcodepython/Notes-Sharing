"use client";

import { ShieldXIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { DangerZoneCard } from "@/components/community/settings/danger-zone-card";
import { DetailsCard } from "@/components/community/settings/details-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunity } from "@/hooks/queries/use-communities";

export function SettingsView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: community, isPending, isError } = useCommunity(slug);

  if (isPending) return <Skeleton className="h-64" />;
  if (isError || community.membership !== "owner") {
    return <EmptyState icon={<ShieldXIcon />} title="Only the owner can change settings" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader title="Settings" description="Details and access for this community." />
      <DetailsCard slug={slug} details={community} />
      <DangerZoneCard slug={slug} name={community.name} />
    </div>
  );
}
