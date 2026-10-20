import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InviteView } from "./invite-view";

export default function InvitePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Suspense fallback={<Skeleton className="h-48 w-full max-w-sm rounded-xl" />}>
        <InviteView />
      </Suspense>
    </main>
  );
}
