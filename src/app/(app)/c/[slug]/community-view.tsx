"use client";

import { LogOutIcon, SearchXIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonLink } from "@/components/common/button-link";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { AccessBadge, CommunityCounts } from "@/components/community/community-badges";
import { JoinButton } from "@/components/community/join-button";
import { NotesSection } from "@/components/note/notes-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunity, useLeaveCommunity } from "@/hooks/queries/use-communities";
import type { CommunityDetail } from "@/schemas/community";

export function CommunityView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: community, isPending, isError } = useCommunity(slug);

  if (isPending) return <Skeleton className="h-32" />;
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
      <PageHeader
        title={community.name}
        badge={<AccessBadge access={community.access} />}
        description={
          <div className="flex flex-col gap-2">
            {community.description && <p>{community.description}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <CommunityCounts members={community.memberCount} notes={community.noteCount} />
              <span>Owner: {community.owner.name}</span>
            </div>
          </div>
        }
        actions={<HeaderActions community={community} />}
      />
      {isMember ? (
        <NotesSection slug={community.slug} />
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

function HeaderActions({ community }: { community: CommunityDetail }) {
  if (community.membership === "owner") {
    return (
      <>
        <ButtonLink href={`/c/${community.slug}/members`} variant="outline">
          <UsersIcon /> Members
        </ButtonLink>
        <ButtonLink href={`/c/${community.slug}/settings`} variant="outline">
          <SettingsIcon /> Settings
        </ButtonLink>
      </>
    );
  }
  if (community.membership === "member") return <LeaveButton slug={community.slug} />;
  return null;
}

function LeaveButton({ slug }: { slug: string }) {
  const router = useRouter();
  const leave = useLeaveCommunity();

  async function onConfirm() {
    await leave.mutateAsync(slug);
    toast.success("You left the community");
    router.push("/communities");
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="outline">
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
