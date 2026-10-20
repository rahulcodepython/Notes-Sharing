import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CommunityView } from "./community-view";

export default function CommunityPage() {
  return (
    <Suspense fallback={<Skeleton className="h-32 rounded-xl" />}>
      <CommunityView />
    </Suspense>
  );
}
