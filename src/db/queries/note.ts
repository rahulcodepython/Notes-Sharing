import "server-only";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { categorySchema } from "@/schemas/category";
import {
  communityNotesSchema,
  downloadResultSchema,
  noteSchema,
  type CreateNoteInput,
} from "@/schemas/note";
import { queryJson } from "../query";

/** CTE body selecting the community only when `userId` is a member. */
const memberCommunity = (userId: string, slug: string) => sql`
  SELECT c.id, c.owner_id FROM community c
  JOIN community_member m ON m.community_id = c.id AND m.user_id = ${userId}
  WHERE c.slug = ${slug}
`;

const driveContextSchema = z.object({
  accountId: z.string(),
  driveFolderId: z.string().nullable(),
  categoryValid: z.boolean(),
});

/**
 * What a Drive call needs: the user's Google account id and Drive folder.
 * Null when the user is not a member of the community.
 */
export function getDriveContext(userId: string, slug: string, categoryId: string | null) {
  return queryJson(
    driveContextSchema.nullable(),
    sql`
      WITH c AS (${memberCommunity(userId, slug)})
      SELECT (
        SELECT json_build_object(
          'accountId', a.id,
          'driveFolderId', u.drive_folder_id,
          'categoryValid', EXISTS (
            SELECT 1 FROM category k WHERE k.id = ${categoryId}::uuid AND k.community_id = c.id
          )
        )
        FROM c
        JOIN "user" u ON u.id = ${userId}
        JOIN account a ON a.user_id = u.id AND a.provider_id = 'google'
      ) AS result
    `,
  );
}

export function saveDriveFolder(userId: string, folderId: string) {
  return queryJson(
    z.boolean(),
    sql`
      WITH upd AS (UPDATE "user" SET drive_folder_id = ${folderId} WHERE id = ${userId} RETURNING id)
      SELECT EXISTS (SELECT 1 FROM upd) AS result
    `,
  );
}

const noteJson = (userId: string) => sql`
  json_build_object(
    'id', n.id,
    'title', n.title,
    'category', json_build_object('id', k.id, 'name', k.name),
    'uploader', json_build_object('id', u.id, 'name', u.name, 'image', u.image),
    'mimeType', n.mime_type,
    'size', n.size,
    'createdAt', n.created_at,
    'downloadCount', (SELECT count(*) FROM note_download d WHERE d.note_id = n.id),
    'canDelete', n.uploader_id = ${userId} OR c.owner_id = ${userId}
  )
`;

/** Categories and notes for the community page in one statement. Null when not a member. */
export function listNotes(userId: string, slug: string) {
  return queryJson(
    communityNotesSchema.nullable(),
    sql`
      WITH c AS (${memberCommunity(userId, slug)})
      SELECT (
        SELECT json_build_object(
          'categories', (
            SELECT coalesce(
              json_agg(
                json_build_object(
                  'id', k.id,
                  'name', k.name,
                  'noteCount', (SELECT count(*) FROM note n WHERE n.category_id = k.id)
                )
                ORDER BY k.name
              ),
              '[]'
            )
            FROM category k WHERE k.community_id = c.id
          ),
          'notes', (
            SELECT coalesce(json_agg(${noteJson(userId)} ORDER BY n.created_at DESC), '[]')
            FROM note n
            JOIN category k ON k.id = n.category_id
            JOIN "user" u ON u.id = n.uploader_id
            WHERE n.community_id = c.id
          )
        )
        FROM c
      ) AS result
    `,
  );
}

/** Returns the existing category when the name is already taken. Null when not a member. */
export function createCategory(userId: string, slug: string, name: string) {
  return queryJson(
    categorySchema.nullable(),
    sql`
      WITH c AS (${memberCommunity(userId, slug)}),
      ins AS (
        INSERT INTO category (community_id, name, created_by)
        SELECT id, ${name}, ${userId} FROM c
        ON CONFLICT (community_id, name) DO UPDATE SET name = excluded.name
        RETURNING id, name
      )
      SELECT (SELECT json_build_object('id', id, 'name', name) FROM ins) AS result
    `,
  );
}

type DriveFile = { id: string; url: string; mimeType: string; size: number };

/** Null when not a member or the category is not in this community. */
export function createNote(userId: string, slug: string, input: CreateNoteInput, file: DriveFile) {
  return queryJson(
    noteSchema.nullable(),
    sql`
      WITH c AS (${memberCommunity(userId, slug)}),
      k AS (SELECT id, name FROM category WHERE id = ${input.categoryId} AND community_id = (SELECT id FROM c)),
      n AS (
        INSERT INTO note (community_id, category_id, uploader_id, title, drive_file_id, drive_url, mime_type, size)
        SELECT c.id, k.id, ${userId}, ${input.title}, ${file.id}, ${file.url}, ${file.mimeType}, ${file.size}
        FROM c, k
        RETURNING *
      )
      SELECT (
        SELECT ${noteJson(userId)}
        FROM n, k, c, "user" u
        WHERE u.id = n.uploader_id
      ) AS result
    `,
  );
}

/** Records the download and returns the Drive link. Null when not a member or unknown note. */
export function downloadNote(userId: string, noteId: string) {
  return queryJson(
    downloadResultSchema.nullable(),
    sql`
      WITH n AS (
        SELECT n.id, n.drive_url FROM note n
        JOIN community_member m ON m.community_id = n.community_id AND m.user_id = ${userId}
        WHERE n.id = ${noteId}
      ),
      d AS (INSERT INTO note_download (note_id, user_id) SELECT id, ${userId} FROM n)
      SELECT (SELECT json_build_object('url', drive_url) FROM n) AS result
    `,
  );
}

const deleteResultSchema = z.enum(["deleted", "forbidden", "not_found"]);

/** Only the uploader or the community owner. The Drive file is left untouched. */
export function deleteNote(userId: string, noteId: string) {
  return queryJson(
    deleteResultSchema,
    sql`
      WITH n AS (
        SELECT n.id, n.uploader_id, c.owner_id FROM note n
        JOIN community c ON c.id = n.community_id
        WHERE n.id = ${noteId}
      ),
      del AS (
        DELETE FROM note USING n
        WHERE note.id = n.id AND ${userId} IN (n.uploader_id, n.owner_id)
        RETURNING note.id
      )
      SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM n) THEN 'not_found'
        WHEN EXISTS (SELECT 1 FROM del) THEN 'deleted'
        ELSE 'forbidden'
      END AS result
    `,
  );
}
