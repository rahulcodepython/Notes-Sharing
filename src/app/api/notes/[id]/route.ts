import { deleteNote } from "@/db/queries/note";
import { ApiError } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { okSchema } from "@/schemas/common";
import { noteParamsSchema } from "@/schemas/note";

export const DELETE = route(okSchema, async ({ ctx, user }) => {
  const { id } = await parseParams(ctx, noteParamsSchema);
  const result = await deleteNote(user.id, id);
  if (result === "not_found") throw new ApiError(404, "Note not found");
  if (result === "forbidden") throw new ApiError(403, "Only the uploader or owner can delete");
  return { ok: true };
});
