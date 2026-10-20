import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = { title: "Community settings" };

export default function CommunitySettingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64" />}>
      <SettingsView />
    </Suspense>
  );
}
