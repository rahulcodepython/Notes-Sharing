"use client";

import { DownloadIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SortableHeader, type DataColumn } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteNote, useDownloadNote } from "@/hooks/queries/use-notes";
import { formatBytes, formatDate } from "@/lib/utils";
import type { Note } from "@/schemas/note";

export const noteColumns: DataColumn<Note>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium">{row.original.title}</span>
        <span className="text-xs text-muted-foreground md:hidden">{row.original.category.name}</span>
      </div>
    ),
  },
  {
    id: "category",
    accessorFn: (note) => note.category.name,
    header: ({ column }) => <SortableHeader column={column} title="Category" />,
    cell: ({ row }) => <Badge variant="secondary">{row.original.category.name}</Badge>,
    meta: { className: "hidden md:table-cell" },
  },
  {
    id: "uploader",
    accessorFn: (note) => note.uploader.name,
    header: ({ column }) => <SortableHeader column={column} title="Uploaded by" />,
    cell: ({ row }) => row.original.uploader.name,
    meta: { className: "hidden lg:table-cell" },
  },
  {
    accessorKey: "size",
    header: ({ column }) => <SortableHeader column={column} title="Size" />,
    cell: ({ row }) => formatBytes(row.original.size),
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Uploaded" />,
    cell: ({ row }) => formatDate(row.original.createdAt),
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "downloadCount",
    header: ({ column }) => <SortableHeader column={column} title="Downloads" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.downloadCount}</span>,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <NoteActions note={row.original} />,
    meta: { className: "text-right" },
  },
];

function NoteActions({ note }: { note: Note }) {
  const download = useDownloadNote();
  const remove = useDeleteNote();

  return (
    <div className="flex justify-end gap-1">
      <Button
        size="sm"
        variant="outline"
        disabled={download.isPending}
        onClick={() => download.mutate(note.id)}
      >
        <DownloadIcon /> Download
      </Button>
      {note.canDelete && (
        <ConfirmDialog
          trigger={
            <Button size="sm" variant="destructive">
              <Trash2Icon /> Delete
            </Button>
          }
          title={`Delete "${note.title}"?`}
          description="It is removed from the community. The file stays in the uploader's Google Drive."
          confirmLabel="Delete"
          pending={remove.isPending}
          onConfirm={async () => {
            await remove.mutateAsync(note.id);
            toast.success("Note deleted");
          }}
        />
      )}
    </div>
  );
}
