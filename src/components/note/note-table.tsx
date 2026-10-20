"use client";

import { DownloadIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteNote, useDownloadNote } from "@/hooks/queries/use-notes";
import { formatBytes, formatDate } from "@/lib/utils";
import type { Note } from "@/schemas/note";

export function NoteTable({ notes }: { notes: Note[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden md:table-cell">Uploaded by</TableHead>
          <TableHead className="hidden sm:table-cell">Size</TableHead>
          <TableHead className="text-right">Downloads</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notes.map((note) => (
          <TableRow key={note.id}>
            <TableCell className="max-w-0 w-full">
              <div className="flex flex-col gap-1">
                <span className="truncate font-medium">{note.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{note.category.name}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{note.uploader.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{formatBytes(note.size)}</TableCell>
            <TableCell className="text-right tabular-nums">{note.downloadCount}</TableCell>
            <TableCell className="text-right">
              <NoteActions note={note} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function NoteActions({ note }: { note: Note }) {
  const download = useDownloadNote();
  const remove = useDeleteNote();

  return (
    <div className="flex justify-end gap-1">
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Download"
        disabled={download.isPending}
        onClick={() => download.mutate(note.id)}
      >
        <DownloadIcon />
      </Button>
      {note.canDelete && (
        <ConfirmDialog
          trigger={
            <Button size="icon-sm" variant="ghost" aria-label="Delete">
              <Trash2Icon />
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
