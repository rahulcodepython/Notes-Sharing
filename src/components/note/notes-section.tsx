"use client";

import { FileTextIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { NoteTable } from "@/components/note/note-table";
import { UploadNoteDialog } from "@/components/note/upload-note-dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityNotes } from "@/hooks/queries/use-notes";

const ALL = "all";

/** Notes of one community. Search and category filter run on the already-loaded list. */
export function NotesSection({ slug }: { slug: string }) {
  const { data, isPending } = useCommunityNotes(slug);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(ALL);

  if (isPending || !data) return <Skeleton className="h-48 rounded-xl" />;

  const query = search.trim().toLowerCase();
  const notes = data.notes.filter(
    (note) =>
      (categoryId === ALL || note.category.id === categoryId) &&
      (!query || note.title.toLowerCase().includes(query)),
  );
  const categoryOptions = [
    { value: ALL, label: "All categories" },
    ...data.categories.map((c) => ({ value: c.id, label: `${c.name} (${c.noteCount})` })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Select
          items={categoryOptions}
          value={categoryId}
          onValueChange={(value) => setCategoryId(value ?? ALL)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <UploadNoteDialog slug={slug} categories={data.categories} />
        </div>
      </div>

      {notes.length ? (
        <NoteTable notes={notes} />
      ) : (
        <EmptyState
          icon={<FileTextIcon />}
          title={data.notes.length ? "No notes match your filters" : "No notes yet"}
          description={data.notes.length ? undefined : "Upload the first one for your classmates."}
        />
      )}
    </div>
  );
}
