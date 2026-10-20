import { downloadNote } from "@/db/queries/note";
import { ApiError } from "@/lib/api/errors";
import { parseParams, route } from "@/lib/api/handler";
import { downloadResultSchema, noteParamsSchema } from "@/schemas/note";

export const POST = route(downloadResultSchema, async ({ ctx, user }) => {
  const { id } = await parseParams(ctx, noteParamsSchema);
  const result = await downloadNote(user.id, id);
  if (!result) throw new ApiError(404, "Note not found");
  return result;
});
