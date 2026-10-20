"use client";

import { ButtonLink } from "@/components/common/button-link";
import { authClient } from "@/lib/auth-client";

/** "Open dashboard" when signed in, otherwise "Sign in". */
export function AuthButton({ size }: { size?: "default" | "lg" }) {
  const { data: session, isPending } = authClient.useSession();
  const signedIn = !isPending && session !== null;

  return (
    <ButtonLink href={signedIn ? "/dashboard" : "/login"} size={size}>
      {signedIn ? "Open dashboard" : "Sign in with Google"}
    </ButtonLink>
  );
}
