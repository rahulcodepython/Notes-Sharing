"use client";

import { toast } from "sonner";
import { UserCell } from "@/components/common/user-cell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResolveRequest } from "@/hooks/queries/use-community-settings";
import { formatDate } from "@/lib/utils";
import type { JoinRequest } from "@/schemas/member";

export function RequestsCard({ slug, requests }: { slug: string; requests: JoinRequest[] }) {
  const resolve = useResolveRequest(slug);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join requests</CardTitle>
        <CardDescription>
          {requests.length ? `${requests.length} waiting for your approval.` : "No pending requests."}
        </CardDescription>
      </CardHeader>
      {requests.length > 0 && (
        <CardContent className="flex flex-col divide-y">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between gap-2 py-2">
              <UserCell name={request.name} email={request.email} image={request.image} />
              <span className="hidden text-xs text-muted-foreground sm:block">
                {formatDate(request.requestedAt)}
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={resolve.isPending}
                  onClick={() => resolve.mutate({ userId: request.id, action: "reject" })}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  disabled={resolve.isPending}
                  onClick={() =>
                    resolve.mutate(
                      { userId: request.id, action: "approve" },
                      { onSuccess: () => toast.success(`${request.name} joined`) },
                    )
                  }
                >
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
