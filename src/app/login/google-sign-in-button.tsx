"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

/** Only allow same-origin relative paths to avoid open redirects. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);

  async function signIn() {
    setPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: safeNext(searchParams.get("next")),
    });
    if (error) {
      toast.error(error.message ?? "Sign in failed");
      setPending(false);
    }
  }

  return (
    <Button className="w-full" onClick={signIn} disabled={pending}>
      {pending ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}
