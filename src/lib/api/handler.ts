import "server-only";
import { unstable_rethrow } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ApiError } from "./errors";

export type SessionUser = { id: string; name: string; email: string };

type RouteParams = { params: Promise<Record<string, string | string[]>> };

type HandlerArgs = { req: NextRequest; ctx: RouteParams; user: SessionUser };

/**
 * Wraps a route handler: requires a session, maps errors to JSON responses,
 * and validates the returned data against `response` before sending it.
 */
export function route<R>(response: z.ZodType<R>, fn: (args: HandlerArgs) => Promise<R>) {
  return async (req: NextRequest, ctx: RouteParams) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) throw new ApiError(401, "Not signed in");

      const { id, name, email } = session.user;
      const data = await fn({ req, ctx, user: { id, name, email } });
      return NextResponse.json(response.parse(data));
    } catch (error) {
      unstable_rethrow(error);
      if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      console.error(error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  };
}

function parseInput<T>(schema: z.ZodType<T>, input: object): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new ApiError(400, z.prettifyError(result.error));
  return result.data;
}

export async function parseParams<T>(ctx: RouteParams, schema: z.ZodType<T>): Promise<T> {
  return parseInput(schema, await ctx.params);
}

export function parseQuery<T>(req: NextRequest, schema: z.ZodType<T>): T {
  return parseInput(schema, Object.fromEntries(req.nextUrl.searchParams));
}

export async function parseBody<T>(req: NextRequest, schema: z.ZodType<T>): Promise<T> {
  const body = await req.json().catch(() => {
    throw new ApiError(400, "Invalid JSON body");
  });
  return parseInput(schema, body);
}
