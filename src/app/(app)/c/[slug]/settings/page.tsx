import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsView } from "./settings-view";

export default function CommunitySettingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
      <SettingsView />
    </Suspense>
  );
}
