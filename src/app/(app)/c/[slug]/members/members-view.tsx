"use client";

import { ShieldXIcon, UsersIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { AddMemberDialog } from "@/components/member/add-member-dialog";
import { InviteDialog } from "@/components/member/invite-dialog";
import { memberColumns } from "@/components/member/member-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommunityMembers } from "@/hooks/queries/use-members";
import type { MemberRow } from "@/schemas/member";

type Filter = "all" | "members" | "requests";

const matchesFilter: Record<Filter, (row: MemberRow) => boolean> = {
  all: () => true,
  members: (row) => row.status !== "requested",
  requests: (row) => row.status === "requested",
};

export function MembersView() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isPending, isError } = useCommunityMembers(slug);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const columns = useMemo(() => memberColumns(slug), [slug]);
  const query = search.trim().toLowerCase();
  // Stable reference: the table resets its page whenever `data` changes identity.
  const rows = useMemo(
    () =>
      (data?.rows ?? []).filter(
        (row) =>
          matchesFilter[filter](row) &&
          (!query ||
            row.name.toLowerCase().includes(query) ||
            row.email.toLowerCase().includes(query)),
      ),
    [data, filter, query],
  );

  if (isPending) return <Skeleton className="h-64" />;
  if (isError) {
    return <EmptyState icon={<ShieldXIcon />} title="Only the owner can manage members" />;
  }

  const count = (f: Filter) => data.rows.filter(matchesFilter[f]).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Members"
        description="Approve requests, add people directly, and manage who belongs here."
        actions={
          <>
            <AddMemberDialog slug={slug} />
            <InviteDialog slug={slug} invite={data.invite} />
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs value={filter} onValueChange={(value: Filter) => setFilter(value)}>
          <TabsList>
            <TabsTrigger value="all">All ({count("all")})</TabsTrigger>
            <TabsTrigger value="members">Members ({count("members")})</TabsTrigger>
            <TabsTrigger value="requests">Requests ({count("requests")})</TabsTrigger>
          </TabsList>
        </Tabs>
        <SearchInput value={search} onChange={setSearch} placeholder="Search name or email" />
      </div>
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => `${row.status}-${row.id}`}
        empty={
          <EmptyState
            icon={<UsersIcon />}
            title={filter === "requests" ? "No pending requests" : "No one matches"}
          />
        }
      />
    </div>
  );
}
