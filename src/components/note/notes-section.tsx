"use client";

import { FileTextIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { SearchInput } from "@/components/common/search-input";
import { noteColumns } from "@/components/note/note-columns";
import { UploadNoteDialog } from "@/components/note/upload-note-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityNotes } from "@/hooks/queries/use-notes";

const ALL = "all";

/** Notes of one community. Search and category filter run on the already-loaded list. */
export function NotesSection({ slug }: { slug: string }) {
  const { data, isPending } = useCommunityNotes(slug);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(ALL);

  const query = search.trim().toLowerCase();
  // Stable reference: the table resets its page whenever `data` changes identity.
  const notes = useMemo(
    () =>
      (data?.notes ?? []).filter(
        (note) =>
          (categoryId === ALL || note.category.id === categoryId) &&
          (!query || note.title.toLowerCase().includes(query)),
      ),
    [data, categoryId, query],
  );

  if (isPending || !data) return <Skeleton className="h-48" />;

  const categoryOptions = [
    { value: ALL, label: "All categories" },
    ...data.categories.map((c) => ({ value: c.id, label: `${c.name} (${c.noteCount})` })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search notes" />
        <Select
          items={categoryOptions}
          value={categoryId}
          onValueChange={(value) => setCategoryId(value ?? ALL)}
        >
          <SelectTrigger className="w-full sm:w-52">
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
        <div className="sm:ml-auto">
          <UploadNoteDialog slug={slug} categories={data.categories} />
        </div>
      </div>
      <DataTable
        columns={noteColumns}
        data={notes}
        getRowId={(note) => note.id}
        empty={
          <EmptyState
            icon={<FileTextIcon />}
            title={data.notes.length ? "No notes match your filters" : "No notes yet"}
            description={data.notes.length ? undefined : "Upload the first one for your classmates."}
          />
        }
      />
    </div>
  );
}
