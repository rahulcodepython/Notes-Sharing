"use client";

import { CheckIcon, CrownIcon, UserMinusIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SortableHeader, type DataColumn } from "@/components/common/data-table";
import { UserCell } from "@/components/common/user-cell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useRemoveMember,
  useResolveRequest,
  useTransferOwnership,
} from "@/hooks/queries/use-members";
import { formatDate } from "@/lib/utils";
import type { MemberRow, MemberStatus } from "@/schemas/member";

const statusBadge: Record<MemberStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  owner: { label: "Owner", variant: "default" },
  member: { label: "Member", variant: "secondary" },
  requested: { label: "Requested", variant: "outline" },
};

export function memberColumns(slug: string): DataColumn<MemberRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="User" />,
      cell: ({ row }) => (
        <UserCell name={row.original.name} email={row.original.email} image={row.original.image} />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const badge = statusBadge[row.original.status];
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      },
    },
    {
      accessorKey: "noteCount",
      header: ({ column }) => <SortableHeader column={column} title="Notes" />,
      cell: ({ row }) => <span className="tabular-nums">{row.original.noteCount}</span>,
    },
    {
      accessorKey: "since",
      header: ({ column }) => <SortableHeader column={column} title="Since" />,
      cell: ({ row }) => formatDate(row.original.since),
      meta: { className: "hidden md:table-cell" },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <MemberActions slug={slug} member={row.original} />,
      meta: { className: "text-right" },
    },
  ];
}

function MemberActions({ slug, member }: { slug: string; member: MemberRow }) {
  const router = useRouter();
  const remove = useRemoveMember(slug);
  const transfer = useTransferOwnership(slug);
  const resolve = useResolveRequest(slug);

  if (member.status === "owner") return null;

  if (member.status === "requested") {
    return (
      <div className="flex justify-end gap-1">
        <Button
          size="sm"
          variant="outline"
          disabled={resolve.isPending}
          onClick={() => resolve.mutate({ userId: member.id, action: "reject" })}
        >
          <XIcon /> Reject
        </Button>
        <Button
          size="sm"
          disabled={resolve.isPending}
          onClick={() =>
            resolve.mutate(
              { userId: member.id, action: "approve" },
              { onSuccess: () => toast.success(`${member.name} joined`) },
            )
          }
        >
          <CheckIcon /> Approve
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      <ConfirmDialog
        trigger={
          <Button size="sm" variant="outline">
            <CrownIcon /> Make owner
          </Button>
        }
        title={`Make ${member.name} the owner?`}
        description="You will become a regular member and lose access to members and settings."
        confirmLabel="Transfer ownership"
        pending={transfer.isPending}
        onConfirm={async () => {
          await transfer.mutateAsync(member.id);
          toast.success(`${member.name} is now the owner`);
          router.push(`/c/${slug}`);
        }}
      />
      <ConfirmDialog
        trigger={
          <Button size="sm" variant="destructive">
            <UserMinusIcon /> Remove
          </Button>
        }
        title={`Remove ${member.name}?`}
        description="Their notes stay in the community."
        confirmLabel="Remove"
        pending={remove.isPending}
        onConfirm={async () => {
          await remove.mutateAsync(member.id);
          toast.success(`${member.name} removed`);
        }}
      />
    </div>
  );
}
