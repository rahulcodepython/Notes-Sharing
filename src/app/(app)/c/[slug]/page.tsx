import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CommunityView } from "./community-view";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <Suspense fallback={<Skeleton className="h-32 rounded-xl" />}>
      <CommunityView />
    </Suspense>
  );
}
