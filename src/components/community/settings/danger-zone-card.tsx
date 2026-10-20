"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteCommunity } from "@/hooks/queries/use-members";

export function DangerZoneCard({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const remove = useDeleteCommunity(slug);

  return (
    <Card className="border-destructive/40 ring-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>These actions cannot be undone.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium">Delete this community</span>
          <span className="text-sm text-muted-foreground">
            Removes all members, requests, categories, notes and download history. Files stay in
            each uploader&apos;s Google Drive.
          </span>
        </div>
        <ConfirmDialog
          trigger={
            <Button variant="destructive">
              <Trash2Icon /> Delete community
            </Button>
          }
          title={`Delete ${name}?`}
          description="Everyone loses access immediately. This cannot be undone."
          confirmLabel="Delete community"
          confirmText={name}
          pending={remove.isPending}
          onConfirm={async () => {
            await remove.mutateAsync();
            toast.success(`${name} deleted`);
            router.push("/communities");
          }}
        />
      </CardContent>
    </Card>
  );
}
