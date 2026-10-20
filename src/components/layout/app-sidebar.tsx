"use client";

import { CompassIcon, FileTextIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { CommunitySwitcher } from "@/components/layout/community-switcher";
import { NavLinks, type NavLink } from "@/components/layout/nav-links";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCurrentCommunity } from "@/hooks/queries/use-communities";

const mainLinks: NavLink[] = [
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon /> },
  { title: "Explore", href: "/explore", icon: <CompassIcon /> },
];

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const community = useCurrentCommunity();

  const communityLinks: NavLink[] = community
    ? [
        { title: "Notes", href: `/c/${community.slug}`, icon: <FileTextIcon /> },
        ...(community.isOwner
          ? [{ title: "Settings", href: `/c/${community.slug}/settings`, icon: <SettingsIcon /> }]
          : []),
      ]
    : [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CommunitySwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks label="Platform" links={mainLinks} />
        {community && <NavLinks label={community.name} links={communityLinks} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
