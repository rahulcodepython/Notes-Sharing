import { z } from "zod";
import { categorySchema, categoryWithCountSchema } from "./category";

export const noteParamsSchema = z.object({ id: z.uuid() });

// requests

export const uploadSessionSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().max(255),
  size: z.number().int().nonnegative(),
});
export type UploadSessionInput = z.infer<typeof uploadSessionSchema>;

export const createNoteSchema = z.object({
  title: z.string().trim().min(2, "At least 2 characters").max(120),
  categoryId: z.uuid("Pick a category"),
  fileId: z.string().min(1),
});
export type CreateNoteInput = z.infer<typeof createNoteSchema>;

/** Upload form fields. The file is uploaded to Drive first, then the note is created with its id. */
export const noteFormSchema = createNoteSchema.omit({ fileId: true }).extend({
  file: z.instanceof(File, { message: "Choose a file" }),
});
export type NoteFormInput = z.infer<typeof noteFormSchema>;

// responses

export const uploadSessionResultSchema = z.object({ uploadUrl: z.url() });

/** What Drive returns after the resumable upload finishes. */
export const uploadedFileSchema = z.object({ id: z.string() });

export const noteSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  category: categorySchema,
  uploader: z.object({ id: z.string(), name: z.string(), image: z.string().nullable() }),
  mimeType: z.string(),
  size: z.number().int(),
  createdAt: z.string(),
  downloadCount: z.number().int(),
  canDelete: z.boolean(),
});
export type Note = z.infer<typeof noteSchema>;

export const communityNotesSchema = z.object({
  categories: z.array(categoryWithCountSchema),
  notes: z.array(noteSchema),
});

export const downloadResultSchema = z.object({ url: z.url() });
