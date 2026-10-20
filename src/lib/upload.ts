import { uploadedFileSchema } from "@/schemas/note";

/**
 * PUTs the file to a Drive resumable upload URL. Uses XHR because fetch has no upload progress.
 * `onProgress` receives 0–100.
 */
export function uploadToDrive(uploadUrl: string, file: File, onProgress: (percent: number) => void) {
  return new Promise<{ id: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Upload to Google Drive failed (${xhr.status})`));
        return;
      }
      const parsed = uploadedFileSchema.safeParse(JSON.parse(xhr.responseText));
      if (parsed.success) resolve(parsed.data);
      else reject(new Error("Unexpected response from Google Drive"));
    };
    xhr.onerror = () => reject(new Error("Upload to Google Drive failed"));
    xhr.send(file);
  });
}
