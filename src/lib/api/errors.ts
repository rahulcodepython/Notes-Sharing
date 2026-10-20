import { z } from "zod";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const apiErrorSchema = z.object({ error: z.string() });

export const notOwner = () => new ApiError(403, "Only the community owner can do this");
