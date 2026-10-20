"use client";

import { UserPlusIcon } from "lucide-react";
import { toast } from "sonner";
import { UserSearch } from "@/components/common/user-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddMember } from "@/hooks/queries/use-members";

export function AddMemberDialog({ slug }: { slug: string }) {
  const addMember = useAddMember(slug);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <UserPlusIcon /> Add member
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Search by Gmail address or name. People must sign in once before they can be added.
          </DialogDescription>
        </DialogHeader>
        <UserSearch
          slug={slug}
          actionLabel="Add"
          pending={addMember.isPending}
          onSelect={(user) =>
            addMember.mutate(user.email, { onSuccess: () => toast.success(`${user.name} added`) })
          }
        />
      </DialogContent>
    </Dialog>
  );
}
