"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useRegenerateInvite, useRevokeInvite } from "@/hooks/queries/use-community-settings";
import { formatDate } from "@/lib/utils";
import { INVITE_TTL_DAYS, type InviteLink } from "@/schemas/invite";

export function InviteCard({ slug, invite }: { slug: string; invite: InviteLink | null }) {
  const regenerate = useRegenerateInvite(slug);
  const revoke = useRevokeInvite(slug);
  const url = invite ? `${window.location.origin}/invite/${invite.token}` : "";

  async function copy() {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite link</CardTitle>
        <CardDescription>
          Anyone with the link can join for {INVITE_TTL_DAYS} days. A new link replaces the old one.
        </CardDescription>
      </CardHeader>
      {invite && (
        <CardContent className="flex flex-col gap-2">
          <InputGroup>
            <InputGroupInput readOnly value={url} onFocus={(e) => e.target.select()} />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Copy link" onClick={copy}>
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <p className="text-xs text-muted-foreground">Expires {formatDate(invite.expiresAt)}</p>
        </CardContent>
      )}
      <CardFooter className="justify-end gap-2">
        {invite && (
          <ConfirmDialog
            trigger={<Button variant="outline">Revoke</Button>}
            title="Revoke invite link?"
            description="The link stops working immediately."
            confirmLabel="Revoke"
            pending={revoke.isPending}
            onConfirm={async () => {
              await revoke.mutateAsync();
            }}
          />
        )}
        <Button disabled={regenerate.isPending} onClick={() => regenerate.mutate()}>
          {invite ? "New link" : "Create link"}
        </Button>
      </CardFooter>
    </Card>
  );
}
