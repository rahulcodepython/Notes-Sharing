import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, initials } from "@/lib/utils";
import type { Account } from "@/schemas/account";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium break-all">{value}</span>
    </div>
  );
}

/** Read-only profile. Name, email and photo come from Google. */
export function ProfileCard({ profile }: { profile: Account["profile"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Managed by your Google account and cannot be edited here.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar className="size-16">
          <AvatarImage src={profile.image ?? undefined} alt={profile.name} />
          <AvatarFallback className="text-lg">{initials(profile.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-3">
          <Row label="Name" value={profile.name} />
          <Row label="Email" value={profile.email} />
          <Row label="Member since" value={formatDate(profile.createdAt)} />
        </div>
      </CardContent>
    </Card>
  );
}
