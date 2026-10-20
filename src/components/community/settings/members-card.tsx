"use client";

import { CrownIcon, UserMinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { UserCell } from "@/components/common/user-cell";
import { UserSearch } from "@/components/common/user-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useAddMember,
  useRemoveMember,
  useTransferOwnership,
} from "@/hooks/queries/use-community-settings";
import { formatDate } from "@/lib/utils";
import type { Member } from "@/schemas/member";

export function MembersCard({ slug, members }: { slug: string; members: Member[] }) {
  const addMember = useAddMember(slug);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Add people who have signed in at least once.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <UserSearch
          slug={slug}
          actionLabel="Add"
          pending={addMember.isPending}
          onSelect={(user) =>
            addMember.mutate(user.email, { onSuccess: () => toast.success(`${user.name} added`) })
          }
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="max-w-0 w-full">
                  <UserCell name={member.name} email={member.email} image={member.image} />
                </TableCell>
                <TableCell className="hidden sm:table-cell">{formatDate(member.joinedAt)}</TableCell>
                <TableCell className="text-right">
                  {member.isOwner ? (
                    <Badge variant="secondary">Owner</Badge>
                  ) : (
                    <MemberActions slug={slug} member={member} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MemberActions({ slug, member }: { slug: string; member: Member }) {
  const router = useRouter();
  const remove = useRemoveMember(slug);
  const transfer = useTransferOwnership(slug);

  return (
    <div className="flex justify-end gap-1">
      <ConfirmDialog
        trigger={
          <Button size="icon-sm" variant="ghost" aria-label="Make owner">
            <CrownIcon />
          </Button>
        }
        title={`Make ${member.name} the owner?`}
        description="You will become a regular member and lose access to these settings."
        confirmLabel="Transfer ownership"
        pending={transfer.isPending}
        onConfirm={async () => {
          await transfer.mutateAsync(member.id);
          toast.success(`${member.name} is now the owner`);
          router.push(`/c/${slug}`);
        }}
      />
      <ConfirmDialog
        trigger={
          <Button size="icon-sm" variant="ghost" aria-label="Remove member">
            <UserMinusIcon />
          </Button>
        }
        title={`Remove ${member.name}?`}
        description="Their notes stay in the community."
        confirmLabel="Remove"
        pending={remove.isPending}
        onConfirm={async () => {
          await remove.mutateAsync(member.id);
          toast.success(`${member.name} removed`);
        }}
      />
    </div>
  );
}
