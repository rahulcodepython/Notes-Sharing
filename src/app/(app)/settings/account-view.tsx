"use client";

import { FileTextIcon, LibraryIcon, UsersRoundIcon } from "lucide-react";
import { useMemo } from "react";
import { accountCommunityColumns } from "@/components/account/account-community-columns";
import { DeleteAccountCard } from "@/components/account/delete-account-card";
import { ProfileCard } from "@/components/account/profile-card";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/hooks/queries/use-account";

export function AccountView() {
  const { data, isPending } = useAccount();
  const owned = useMemo(() => (data?.communities ?? []).filter((c) => c.isOwner), [data]);

  if (isPending || !data) return <Skeleton className="h-64" />;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageHeader title="Account settings" description="Your profile and activity." />
      <ProfileCard profile={data.profile} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Communities created" value={data.stats.created} icon={<LibraryIcon />} />
        <StatCard label="Communities joined" value={data.stats.joined} icon={<UsersRoundIcon />} />
        <StatCard label="Total uploads" value={data.stats.uploads} icon={<FileTextIcon />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Uploads by community</CardTitle>
          <CardDescription>How many notes you shared in each community.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={accountCommunityColumns}
            data={data.communities}
            getRowId={(c) => c.id}
            empty={<EmptyState title="You haven't joined any community yet" />}
          />
        </CardContent>
      </Card>
      <DeleteAccountCard email={data.profile.email} owned={owned} />
    </div>
  );
}
