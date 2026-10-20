import { deleteAccount, getAccount } from "@/db/queries/account";
import { ApiError } from "@/lib/api/errors";
import { parseBody, route } from "@/lib/api/handler";
import { accountSchema, deleteAccountSchema } from "@/schemas/account";
import { okSchema } from "@/schemas/common";

export const GET = route(accountSchema, ({ user }) => getAccount(user.id));

export const DELETE = route(okSchema, async ({ req, user }) => {
  const { email } = await parseBody(req, deleteAccountSchema);
  const result = await deleteAccount(user.id, email);
  if (result === "email_mismatch") throw new ApiError(400, "Email does not match your account");
  if (result === "owns_communities") {
    throw new ApiError(409, "Transfer ownership of your communities before deleting your account");
  }
  return { ok: true };
});
