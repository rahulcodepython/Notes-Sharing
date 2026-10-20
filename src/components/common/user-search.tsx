"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { UserCell } from "@/components/common/user-cell";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useUserSearch } from "@/hooks/queries/use-community-settings";
import { useDebounce } from "@/hooks/use-debounce";
import type { UserSummary } from "@/schemas/member";

/** Debounced search over signed-up users who are not yet members of `slug`. */
export function UserSearch({
  slug,
  actionLabel,
  pending,
  onSelect,
}: {
  slug: string;
  actionLabel: string;
  pending?: boolean;
  onSelect: (user: UserSummary) => void;
}) {
  const [search, setSearch] = useState("");
  const q = useDebounce(search.trim());
  const { data: users, isFetching } = useUserSearch(slug, q);

  return (
    <div className="flex flex-col gap-2">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search by Gmail address or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      {q.length >= 2 && (
        <div className="flex flex-col divide-y rounded-lg border">
          {users?.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-2 p-2">
              <UserCell name={user.name} email={user.email} image={user.image} />
              <Button
                size="sm"
                disabled={pending}
                onClick={() => {
                  onSelect(user);
                  setSearch("");
                }}
              >
                {actionLabel}
              </Button>
            </div>
          ))}
          {users?.length === 0 && !isFetching && (
            <p className="p-3 text-sm text-muted-foreground">
              No user found. They must sign in once before they can be added.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
