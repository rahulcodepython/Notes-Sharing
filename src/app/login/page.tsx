import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignInButton } from "./google-sign-in-button";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Notes Sharing</CardTitle>
          <CardDescription>
            Sign in with Google. We also ask for Drive access so your notes can be stored in your
            own Drive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <GoogleSignInButton />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
