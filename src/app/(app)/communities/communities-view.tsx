"use client";

import { CompassIcon, LibraryIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/common/button-link";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { myCommunityColumns } from "@/components/community/community-columns";
import { CreateCommunityDialog } from "@/components/community/create-community-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyCommunities } from "@/hooks/queries/use-communities";

export function CommunitiesView() {
  const { data: communities, isPending } = useMyCommunities();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const query = search.trim().toLowerCase();
  // Stable reference: the table resets its page whenever `data` changes identity.
  const rows = useMemo(
    () => (communities ?? []).filter((c) => !query || c.name.toLowerCase().includes(query)),
    [communities, query],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My communities"
        description="Communities you own or belong to."
        actions={
          <>
            <ButtonLink href="/explore" variant="outline">
              <CompassIcon /> Explore
            </ButtonLink>
            <Button onClick={() => setCreating(true)}>
              <PlusIcon /> Create community
            </Button>
          </>
        }
      />
      <SearchInput value={search} onChange={setSearch} placeholder="Search your communities" />
      {isPending ? (
        <Skeleton className="h-48" />
      ) : (
        <DataTable
          columns={myCommunityColumns}
          data={rows}
          getRowId={(row) => row.id}
          empty={
            <EmptyState
              icon={<LibraryIcon />}
              title={query ? "No communities match your search" : "You haven't joined any community yet"}
              description={query ? undefined : "Explore public communities or create your own."}
            />
          }
        />
      )}
      <CreateCommunityDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
