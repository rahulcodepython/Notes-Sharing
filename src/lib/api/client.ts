import { z } from "zod";
import { ApiError, apiErrorSchema } from "./errors";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

/** Typed fetch for our own API. Every response is validated with `schema`. */
export async function api<T>(
  path: string,
  schema: z.ZodType<T>,
  options: { method?: Method; body?: object } = {},
): Promise<T> {
  const res = await fetch(path, {
    method: options.method ?? "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const json = await res.json();

  if (!res.ok) {
    const parsed = apiErrorSchema.safeParse(json);
    throw new ApiError(res.status, parsed.success ? parsed.data.error : res.statusText);
  }
  return schema.parse(json);
}
