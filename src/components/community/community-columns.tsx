"use client";

import Link from "next/link";
import { SortableHeader, type DataColumn } from "@/components/common/data-table";
import { AccessBadge } from "@/components/community/community-badges";
import { JoinButton } from "@/components/community/join-button";
import { Badge } from "@/components/ui/badge";
import type { ExploreCommunity, MyCommunity } from "@/schemas/community";

const numberCell = (value: number) => <span className="tabular-nums">{value}</span>;

export const myCommunityColumns: DataColumn<MyCommunity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Community" />,
    cell: ({ row }) => (
      <Link href={`/c/${row.original.slug}`} className="font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "access",
    header: "Access",
    cell: ({ row }) => <AccessBadge access={row.original.access} />,
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "isOwner",
    header: "Role",
    cell: ({ row }) =>
      row.original.isOwner ? <Badge>Owner</Badge> : <Badge variant="secondary">Member</Badge>,
  },
  {
    accessorKey: "memberCount",
    header: ({ column }) => <SortableHeader column={column} title="Members" />,
    cell: ({ row }) => numberCell(row.original.memberCount),
  },
  {
    accessorKey: "noteCount",
    header: ({ column }) => <SortableHeader column={column} title="Notes" />,
    cell: ({ row }) => numberCell(row.original.noteCount),
  },
];

export const exploreCommunityColumns: DataColumn<ExploreCommunity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Community" />,
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col">
        <Link href={`/c/${row.original.slug}`} className="font-medium hover:underline">
          {row.original.name}
        </Link>
        {row.original.description && (
          <span className="line-clamp-1 text-xs text-muted-foreground">{row.original.description}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "access",
    header: "Access",
    cell: ({ row }) => <AccessBadge access={row.original.access} />,
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "memberCount",
    header: ({ column }) => <SortableHeader column={column} title="Members" />,
    cell: ({ row }) => numberCell(row.original.memberCount),
  },
  {
    accessorKey: "noteCount",
    header: ({ column }) => <SortableHeader column={column} title="Notes" />,
    cell: ({ row }) => numberCell(row.original.noteCount),
    meta: { className: "hidden sm:table-cell" },
  },
  {
    id: "action",
    header: () => <span className="sr-only">Action</span>,
    cell: ({ row }) => (
      <JoinButton
        slug={row.original.slug}
        access={row.original.access}
        requested={row.original.requested}
      />
    ),
    meta: { className: "text-right" },
  },
];
