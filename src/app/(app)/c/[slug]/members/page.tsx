import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MembersView } from "./members-view";

export const metadata: Metadata = { title: "Members" };

export default function CommunityMembersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64" />}>
      <MembersView />
    </Suspense>
  );
}
