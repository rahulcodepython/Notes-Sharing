import "server-only";
import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

const API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const FOLDER_NAME = "Notes Sharing";

/** Valid (refreshed if needed) Google access token for the signed-in user's account. */
export async function getDriveToken(accountId: string, headers: Headers) {
  const { accessToken } = await auth.api.getAccessToken({ body: { accountId }, headers });
  if (!accessToken) throw new ApiError(403, "Google Drive access missing. Sign out and sign in again.");
  return accessToken;
}

async function drive(token: string, url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init.headers },
  });
  if (res.status === 401 || res.status === 403) {
    throw new ApiError(403, "Google Drive access denied. Sign out and sign in again, allowing Drive.");
  }
  if (!res.ok) {
    console.error("Drive error", res.status, await res.text());
    throw new ApiError(502, "Google Drive request failed");
  }
  return res;
}

const idSchema = z.object({ id: z.string() });

export async function createFolder(token: string) {
  const res = await drive(token, `${API}/files?fields=id`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" }),
  });
  return idSchema.parse(await res.json()).id;
}

/**
 * Starts a resumable upload. The browser then PUTs the file to the returned URL.
 * `Origin` lets Drive accept that cross-origin PUT.
 */
export async function createUploadSession(
  token: string,
  folderId: string,
  file: { fileName: string; mimeType: string; size: number },
) {
  const res = await drive(token, `${UPLOAD_API}/files?uploadType=resumable&fields=id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Upload-Content-Type": file.mimeType || "application/octet-stream",
      "X-Upload-Content-Length": String(file.size),
      Origin: new URL(env.BETTER_AUTH_URL).origin,
    },
    body: JSON.stringify({ name: file.fileName, parents: [folderId] }),
  });
  const uploadUrl = res.headers.get("Location");
  if (!uploadUrl) throw new ApiError(502, "Google Drive did not return an upload URL");
  return uploadUrl;
}

const fileSchema = z.object({
  id: z.string(),
  mimeType: z.string(),
  size: z.coerce.number().int().default(0),
  webContentLink: z.url().optional(),
  webViewLink: z.url(),
});

/** Makes the file readable by anyone with the link and returns its metadata. */
export async function shareFile(token: string, fileId: string) {
  const [res] = await Promise.all([
    drive(token, `${API}/files/${fileId}?fields=id,mimeType,size,webContentLink,webViewLink`),
    drive(token, `${API}/files/${fileId}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "reader", type: "anyone" }),
    }),
  ]);
  const file = fileSchema.parse(await res.json());
  return { ...file, url: file.webContentLink ?? file.webViewLink };
}
