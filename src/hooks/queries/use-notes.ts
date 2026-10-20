"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { uploadToDrive } from "@/lib/upload";
import { categorySchema } from "@/schemas/category";
import { okSchema } from "@/schemas/common";
import {
  communityNotesSchema,
  downloadResultSchema,
  noteSchema,
  uploadSessionResultSchema,
  type NoteFormInput,
} from "@/schemas/note";
import { communityKeys } from "./use-communities";

const notesKey = (slug: string) => [...communityKeys.all, "notes", slug] as const;

export function useCommunityNotes(slug: string) {
  return useQuery({
    queryKey: notesKey(slug),
    queryFn: () => api(`/api/communities/${slug}/notes`, communityNotesSchema),
  });
}

/** Note changes affect counts on community lists too, so refresh all community data. */
function useInvalidateNotes() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: communityKeys.all });
}

export function useCreateCategory(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      api(`/api/communities/${slug}/categories`, categorySchema, { method: "POST", body: { name } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesKey(slug) }),
  });
}

/** Upload session, then direct browser → Drive upload with progress, then save the note. */
export function useUploadNote(slug: string) {
  const invalidate = useInvalidateNotes();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({ title, categoryId, file }: NoteFormInput) => {
      setProgress(0);
      const { uploadUrl } = await api(
        `/api/communities/${slug}/notes/upload-session`,
        uploadSessionResultSchema,
        { method: "POST", body: { fileName: file.name, mimeType: file.type, size: file.size } },
      );
      const { id } = await uploadToDrive(uploadUrl, file, setProgress);
      return api(`/api/communities/${slug}/notes`, noteSchema, {
        method: "POST",
        body: { title, categoryId, fileId: id },
      });
    },
    onSuccess: invalidate,
  });

  return { ...mutation, progress };
}

export function useDownloadNote() {
  const invalidate = useInvalidateNotes();
  return useMutation({
    mutationFn: (noteId: string) =>
      api(`/api/notes/${noteId}/download`, downloadResultSchema, { method: "POST" }),
    onSuccess: ({ url }) => {
      window.location.assign(url);
      return invalidate();
    },
  });
}

export function useDeleteNote() {
  const invalidate = useInvalidateNotes();
  return useMutation({
    mutationFn: (noteId: string) => api(`/api/notes/${noteId}`, okSchema, { method: "DELETE" }),
    onSuccess: invalidate,
  });
}
