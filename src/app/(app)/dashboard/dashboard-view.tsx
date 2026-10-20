"use client";

import { DownloadIcon, FileTextIcon, UsersIcon, UsersRoundIcon } from "lucide-react";
import { ButtonLink } from "@/components/common/button-link";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { DailyBarChart } from "@/components/dashboard/daily-bar-chart";
import { TopUploaders } from "@/components/dashboard/top-uploaders";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/queries/use-dashboard";

export function DashboardView() {
  const { data, isPending } = useDashboard();

  if (isPending || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  if (data.stats.communities === 0) {
    return (
      <EmptyState
        icon={<UsersRoundIcon />}
        title="You haven't joined any community yet"
        description="Join a community to see and share notes, or create your own."
        action={<ButtonLink href="/explore">Explore communities</ButtonLink>}
      />
    );
  }

  const { stats } = data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Activity across all your communities." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Communities" value={stats.communities} icon={<UsersRoundIcon />} />
        <StatCard label="Members" value={stats.members} icon={<UsersIcon />} />
        <StatCard label="Notes" value={stats.notes} icon={<FileTextIcon />} />
        <StatCard label="Downloads" value={stats.downloads} icon={<DownloadIcon />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DailyBarChart
          title="Notes uploaded"
          description="Last 30 days"
          data={data.activity}
          metric="notes"
          label="Notes"
        />
        <DailyBarChart
          title="Downloads"
          description="Last 30 days"
          data={data.activity}
          metric="downloads"
          label="Downloads"
        />
        <CategoryChart categories={data.categories} />
        <TopUploaders uploaders={data.topUploaders} />
      </div>
    </div>
  );
}
