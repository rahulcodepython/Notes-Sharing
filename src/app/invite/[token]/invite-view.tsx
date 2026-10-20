"use client";

import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcceptInvite, useInvitePreview } from "@/hooks/queries/use-invites";

export function InviteView() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { data: invite, isPending, isError } = useInvitePreview(token);
  const accept = useAcceptInvite();

  if (isPending) return <Skeleton className="h-48 w-full max-w-sm rounded-xl" />;
  if (isError) {
    return (
      <EmptyState
        icon={<LinkIcon />}
        title="This invite link is invalid or has expired"
        description="Ask the community owner for a new link."
        action={<Button render={<Link href="/dashboard" />}>Go to dashboard</Button>}
      />
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardDescription>You&apos;re invited to join</CardDescription>
        <CardTitle className="text-xl">{invite.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {invite.description && <p className="text-sm text-muted-foreground">{invite.description}</p>}
        <p className="text-sm text-muted-foreground">{invite.memberCount} members</p>
      </CardContent>
      <CardFooter>
        {invite.isMember ? (
          <Button className="w-full" render={<Link href={`/c/${invite.slug}`} />}>
            You&apos;re already a member. Open community
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={accept.isPending}
            onClick={() =>
              accept.mutate(token, { onSuccess: ({ slug }) => router.push(`/c/${slug}`) })
            }
          >
            Join community
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
