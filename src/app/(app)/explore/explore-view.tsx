"use client";

import { CompassIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { CommunityCard } from "@/components/community/community-card";
import { CreateCommunityDialog } from "@/components/community/create-community-dialog";
import { JoinButton } from "@/components/community/join-button";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useExploreCommunities } from "@/hooks/queries/use-communities";
import { useDebounce } from "@/hooks/use-debounce";

export function ExploreView() {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const q = useDebounce(search.trim());
  const { data: communities, isPending } = useExploreCommunities(q);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Explore</h1>
          <p className="text-sm text-muted-foreground">Public communities you haven&apos;t joined.</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <PlusIcon /> Create community
        </Button>
      </div>

      <InputGroup className="max-w-sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search communities"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : communities?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <CommunityCard
              key={c.id}
              name={c.name}
              description={c.description}
              access={c.access}
              memberCount={c.memberCount}
              noteCount={c.noteCount}
              action={<JoinButton slug={c.slug} access={c.access} requested={c.requested} />}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CompassIcon />}
          title={q ? "No communities match your search" : "No communities to explore yet"}
          description="Create one and invite your classmates."
        />
      )}

      <CreateCommunityDialog open={creating} onOpenChange={setCreating} />
    </div>
  );
}
