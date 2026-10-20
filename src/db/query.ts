import "server-only";
import type { SQL } from "drizzle-orm";
import { z } from "zod";
import { db } from ".";

/**
 * Runs a single statement that returns one row with a `result` json column
 * (built with json_build_object / json_agg) and validates it with `schema`.
 */
export async function queryJson<T>(schema: z.ZodType<T>, query: SQL): Promise<T> {
  const { rows } = await db.execute(query);
  return schema.parse(rows[0]?.result);
}

/** Escapes LIKE wildcards in user input. */
export function likeEscape(input: string) {
  return input.replace(/[\\%_]/g, "\\$&");
}
