"use client";

import { FileTextIcon, LogOutIcon, SearchXIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { AccessBadge, CommunityCounts } from "@/components/community/community-card";
import { JoinButton } from "@/components/community/join-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunity, useLeaveCommunity } from "@/hooks/queries/use-communities";
import type { CommunityDetail } from "@/schemas/community";

export function CommunityView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: community, isPending, isError } = useCommunity(slug);

  if (isPending) return <Skeleton className="h-32 rounded-xl" />;
  if (isError) {
    return (
      <EmptyState
        icon={<SearchXIcon />}
        title="Community not found"
        description="It may be private or no longer exist."
      />
    );
  }

  const isMember = community.membership === "owner" || community.membership === "member";

  return (
    <div className="flex flex-col gap-6">
      <CommunityHeader community={community} />
      {isMember ? (
        <EmptyState
          icon={<FileTextIcon />}
          title="No notes yet"
          description="Note uploads arrive in Phase 5."
        />
      ) : (
        <EmptyState
          title="You're not a member yet"
          description={
            community.membership === "requested"
              ? "Your request is waiting for the owner's approval."
              : "Join to see and share notes."
          }
          action={
            community.access !== "private" && (
              <JoinButton
                slug={community.slug}
                access={community.access}
                requested={community.membership === "requested"}
              />
            )
          }
        />
      )}
    </div>
  );
}

function CommunityHeader({ community }: { community: CommunityDetail }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{community.name}</h1>
          <AccessBadge access={community.access} />
        </div>
        {community.description && (
          <p className="max-w-2xl text-muted-foreground">{community.description}</p>
        )}
        <CommunityCounts members={community.memberCount} notes={community.noteCount} />
        <p className="text-xs text-muted-foreground">Owner: {community.owner.name}</p>
      </div>
      {community.membership === "member" && <LeaveButton slug={community.slug} />}
    </div>
  );
}

function LeaveButton({ slug }: { slug: string }) {
  const router = useRouter();
  const leave = useLeaveCommunity();

  async function onConfirm() {
    await leave.mutateAsync(slug);
    toast.success("You left the community");
    router.push("/dashboard");
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline" size="sm">
          <LogOutIcon /> Leave
        </Button>
      }
      title="Leave community?"
      description="You will lose access to its notes. You can join again later if it is public."
      confirmLabel="Leave"
      pending={leave.isPending}
      onConfirm={onConfirm}
    />
  );
}
