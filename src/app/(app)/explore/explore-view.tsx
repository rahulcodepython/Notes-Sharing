"use client";

import { CompassIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { exploreCommunityColumns } from "@/components/community/community-columns";
import { CreateCommunityDialog } from "@/components/community/create-community-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useExploreCommunities } from "@/hooks/queries/use-communities";
import { useDebounce } from "@/hooks/use-debounce";

export function ExploreView() {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const q = useDebounce(search.trim());
  const { data: communities, isPending } = useExploreCommunities(q);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Explore"
        description="Public communities you haven't joined yet."
        actions={
          <Button onClick={() => setCreating(true)}>
            <PlusIcon /> Create community
          </Button>
        }
      />
      <SearchInput value={search} onChange={setSearch} placeholder="Search communities" />
      {isPending ? (
        <Skeleton className="h-48" />
      ) : (
        <DataTable
          columns={exploreCommunityColumns}
          data={communities ?? []}
          getRowId={(row) => row.id}
          empty={
            <EmptyState
              icon={<CompassIcon />}
              title={q ? "No communities match your search" : "No communities to explore yet"}
              description="Create one and invite your classmates."
            />
          }
        />
      )}
      <CreateCommunityDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
