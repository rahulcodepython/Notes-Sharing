"use client";

import Link from "next/link";
import { SortableHeader, type DataColumn } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import type { AccountCommunity } from "@/schemas/account";

export const accountCommunityColumns: DataColumn<AccountCommunity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Community" />,
    cell: ({ row }) =>
      row.original.isMember ? (
        <Link href={`/c/${row.original.slug}`} className="font-medium hover:underline">
          {row.original.name}
        </Link>
      ) : (
        <span className="font-medium">{row.original.name}</span>
      ),
  },
  {
    id: "role",
    accessorFn: (c) => (c.isOwner ? "Owner" : c.isMember ? "Member" : "Left"),
    header: "Role",
    cell: ({ row }) =>
      row.original.isOwner ? (
        <Badge>Owner</Badge>
      ) : row.original.isMember ? (
        <Badge variant="secondary">Member</Badge>
      ) : (
        <Badge variant="outline">Left</Badge>
      ),
  },
  {
    accessorKey: "uploads",
    header: ({ column }) => <SortableHeader column={column} title="Your uploads" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.uploads}</span>,
    meta: { className: "text-right" },
  },
];
