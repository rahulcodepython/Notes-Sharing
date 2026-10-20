"use client";

import { CopyIcon, QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRegenerateInvite, useRevokeInvite } from "@/hooks/queries/use-members";
import { formatDate } from "@/lib/utils";
import { INVITE_TTL_DAYS, type InviteLink } from "@/schemas/invite";

/** Invite link as a QR code and a copyable URL. One link per community; a new one replaces it. */
export function InviteDialog({ slug, invite }: { slug: string; invite: InviteLink | null }) {
  const regenerate = useRegenerateInvite(slug);
  const revoke = useRevokeInvite(slug);
  const url = invite ? `${window.location.origin}/invite/${invite.token}` : null;

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success("Link copied");
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <QrCodeIcon /> Invite
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people</DialogTitle>
          <DialogDescription>
            Anyone who scans the code or opens the link can join for {INVITE_TTL_DAYS} days.
          </DialogDescription>
        </DialogHeader>
        {url && invite ? (
          <div className="flex flex-col items-center gap-4">
            <div className="border bg-white p-4">
              <QRCodeSVG value={url} size={192} marginSize={0} />
            </div>
            <InputGroup>
              <InputGroupInput readOnly value={url} onFocus={(e) => e.target.select()} />
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-xs" aria-label="Copy link" onClick={() => copy(url)}>
                  <CopyIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <p className="self-start text-xs text-muted-foreground">
              Expires {formatDate(invite.expiresAt)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">There is no active invite link.</p>
        )}
        <DialogFooter>
          {invite && (
            <Button variant="outline" disabled={revoke.isPending} onClick={() => revoke.mutate()}>
              Revoke
            </Button>
          )}
          <Button disabled={regenerate.isPending} onClick={() => regenerate.mutate()}>
            {invite ? "New link" : "Create link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
