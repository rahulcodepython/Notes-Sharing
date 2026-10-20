import { getDriveContext, saveDriveFolder } from "@/db/queries/note";
import { ApiError } from "@/lib/api/errors";
import { parseBody, parseParams, route } from "@/lib/api/handler";
import { createFolder, createUploadSession, getDriveToken } from "@/lib/drive";
import { slugParamsSchema } from "@/schemas/community";
import { uploadSessionResultSchema, uploadSessionSchema } from "@/schemas/note";

/** Step 1 of an upload: returns a Drive resumable URL the browser uploads the file to. */
export const POST = route(uploadSessionResultSchema, async ({ req, ctx, user }) => {
  const { slug } = await parseParams(ctx, slugParamsSchema);
  const file = await parseBody(req, uploadSessionSchema);

  const drive = await getDriveContext(user.id, slug, null);
  if (!drive) throw new ApiError(403, "Join the community to upload notes");

  const token = await getDriveToken(drive.accountId, req.headers);
  let folderId = drive.driveFolderId;
  if (!folderId) {
    folderId = await createFolder(token);
    await saveDriveFolder(user.id, folderId);
  }
  return { uploadUrl: await createUploadSession(token, folderId, file) };
});
