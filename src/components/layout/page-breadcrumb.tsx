"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCurrentCommunity } from "@/hooks/queries/use-communities";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  communities: "My communities",
  explore: "Explore",
  members: "Members",
  settings: "Settings",
};

type Crumb = { label: string; href: string };

/** Builds crumbs from the URL. `/c/[slug]` collapses into one crumb named after the community. */
function useCrumbs(): Crumb[] {
  const pathname = usePathname();
  const community = useCurrentCommunity();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");
    if (segment === "c") continue;
    if (segments[i - 1] === "c") {
      crumbs.push({ label: community?.name ?? segment, href });
    } else {
      const label = i === 0 && segment === "settings" ? "Account settings" : labels[segment];
      crumbs.push({ label: label ?? segment, href });
    }
  }
  return crumbs;
}

export function PageBreadcrumb() {
  const crumbs = useCrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
