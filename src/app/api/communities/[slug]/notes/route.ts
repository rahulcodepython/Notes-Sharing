import { createNote, getDriveContext, listNotes } from "@/db/queries/note";
import { ApiError } from "@/lib/api/errors";
import { parseBody, parseParams, route } from "@/lib/api/handler";
import { getDriveToken, shareFile } from "@/lib/drive";
import { slugParamsSchema } from "@/schemas/community";
import { communityNotesSchema, createNoteSchema, noteSchema } from "@/schemas/note";

const notMember = () => new ApiError(403, "Join the community to see its notes");

export const GET = route(communityNotesSchema, async ({ ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const result = await listNotes(user.id, slug);
  if (!result) throw notMember();
  return result;
});

/** Step 3 of an upload: shares the uploaded Drive file and saves the note. */
export const POST = route(noteSchema, async ({ req, ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const input = await parseBody(req, createNoteSchema);

  const drive = await getDriveContext(user.id, slug, input.categoryId);
  if (!drive) throw notMember();
  if (!drive.categoryValid) throw new ApiError(400, "Unknown category");

  const token = await getDriveToken(drive.accountId, req.headers);
  const file = await shareFile(token, input.fileId);
  const note = await createNote(user.id, slug, input, file);
  if (!note) throw notMember();
  return note;
});
