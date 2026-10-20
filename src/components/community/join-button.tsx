"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useJoinCommunity } from "@/hooks/queries/use-communities";

/** Join (open) or request to join (request). Shows a disabled state once requested. */
export function JoinButton({
  slug,
  access,
  requested,
}: {
  slug: string;
  access: "open" | "request";
  requested: boolean;
}) {
  const router = useRouter();
  const join = useJoinCommunity();

  if (requested) {
    return (
      <Button size="sm" variant="outline" disabled>
        Requested
      </Button>
    );
  }

  function onJoin() {
    join.mutate(slug, {
      onSuccess: ({ status }) => {
        if (status === "joined") {
          toast.success("Joined community");
          router.push(`/c/${slug}`);
        } else {
          toast.success("Request sent to the owner");
        }
      },
    });
  }

  return (
    <Button size="sm" disabled={join.isPending} onClick={onJoin}>
      {access === "open" ? "Join" : "Request to join"}
    </Button>
  );
}
