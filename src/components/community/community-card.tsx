import { FileTextIcon, UsersIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { communityAccessOptions, type CommunityAccess } from "@/schemas/community";

export function AccessBadge({ access }: { access: CommunityAccess }) {
  const label = communityAccessOptions.find((o) => o.value === access)?.label ?? access;
  return <Badge variant="secondary">{label}</Badge>;
}

export function CommunityCounts({ members, notes }: { members: number; notes: number }) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <UsersIcon className="size-4" /> {members} {members === 1 ? "member" : "members"}
      </span>
      <span className="flex items-center gap-1">
        <FileTextIcon className="size-4" /> {notes} {notes === 1 ? "note" : "notes"}
      </span>
    </div>
  );
}

export function CommunityCard({
  name,
  description,
  access,
  memberCount,
  noteCount,
  action,
}: {
  name: string;
  description: string | null;
  access: CommunityAccess;
  memberCount: number;
  noteCount: number;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardAction>
          <AccessBadge access={access} />
        </CardAction>
        {description && <CardDescription className="line-clamp-2">{description}</CardDescription>}
      </CardHeader>
      <CardFooter className="mt-auto justify-between gap-2">
        <CommunityCounts members={memberCount} notes={noteCount} />
        {action}
      </CardFooter>
    </Card>
  );
}
