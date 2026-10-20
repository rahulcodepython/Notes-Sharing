"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteAccount } from "@/hooks/queries/use-account";
import { authClient } from "@/lib/auth-client";
import type { AccountCommunity } from "@/schemas/account";

export function DeleteAccountCard({
  email,
  owned,
}: {
  email: string;
  owned: AccountCommunity[];
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const remove = useDeleteAccount();

  async function onConfirm() {
    await remove.mutateAsync(email);
    // The session row is already gone; this clears the cookie.
    await authClient.signOut().catch(() => undefined);
    queryClient.clear();
    toast.success("Your account was deleted");
    router.replace("/");
  }

  return (
    <Card className="border-destructive/40 ring-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>Deleting your account cannot be undone.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          This removes your profile, memberships, join requests, every note you uploaded and its
          download history. Files stay in the &quot;Notes Sharing&quot; folder of your own Google
          Drive.
        </p>
        {owned.length > 0 ? (
          <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3 text-sm">
            <span className="font-medium">Transfer ownership first</span>
            <span className="text-muted-foreground">
              You own {owned.length === 1 ? "this community" : "these communities"}. Make another
              member the owner from the Members page, or delete the community from its Settings.
            </span>
            <div className="flex flex-wrap gap-2">
              {owned.map((c) => (
                <Link
                  key={c.id}
                  href={`/c/${c.slug}/members`}
                  className="font-medium text-primary hover:underline"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div>
          <ConfirmDialog
            trigger={
              <Button variant="destructive" disabled={owned.length > 0}>
                <Trash2Icon /> Delete account
              </Button>
            }
            title="Delete your account?"
            description="All your data in Notes Sharing is removed immediately."
            confirmLabel="Delete account"
            confirmText={email}
            pending={remove.isPending}
            onConfirm={onConfirm}
          />
        </div>
      </CardContent>
    </Card>
  );
}
