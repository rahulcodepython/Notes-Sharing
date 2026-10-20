"use client";

import { ChevronsUpDownIcon, CompassIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CreateCommunityDialog } from "@/components/community/create-community-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentCommunity, useMyCommunities } from "@/hooks/queries/use-communities";
import { initials } from "@/lib/utils";

export function CommunitySwitcher() {
  const { isMobile } = useSidebar();
  const { data: communities = [] } = useMyCommunities();
  const current = useCurrentCommunity();
  const [creating, setCreating] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            {current ? (
              <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                {initials(current.name)}
              </div>
            ) : (
              <Image src="/logo.png" alt="" width={32} height={32} className="size-8" />
            )}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{current?.name ?? "Notes Sharing"}</span>
              <span className="truncate text-xs">
                {current ? `${current.memberCount} members` : "Select a community"}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                My communities
              </DropdownMenuLabel>
              {communities.length === 0 && (
                <DropdownMenuItem disabled className="p-2">
                  You haven&apos;t joined any community yet
                </DropdownMenuItem>
              )}
              {communities.map((community) => (
                <DropdownMenuItem
                  key={community.id}
                  render={<Link href={`/c/${community.slug}`} />}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border text-xs">
                    {initials(community.name)}
                  </div>
                  {community.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setCreating(true)} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <PlusIcon className="size-4" />
                </div>
                <span className="text-muted-foreground">Create community</span>
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/explore" />} className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <CompassIcon className="size-4" />
                </div>
                <span className="text-muted-foreground">Explore communities</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateCommunityDialog open={creating} onOpenChange={setCreating} />
    </SidebarMenu>
  );
}
