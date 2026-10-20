"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, FormTextarea } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useCreateCommunity } from "@/hooks/queries/use-communities";
import {
  communityAccessOptions,
  createCommunitySchema,
  type CreateCommunityInput,
} from "@/schemas/community";

export function CreateCommunityDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const createCommunity = useCreateCommunity();
  const form = useForm<CreateCommunityInput>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: { name: "", description: "", access: "open" },
  });

  function onSubmit(values: CreateCommunityInput) {
    createCommunity.mutate(values, {
      onSuccess: (community) => {
        toast.success(`Created ${community.name}`);
        form.reset();
        onOpenChange(false);
        router.push(`/c/${community.slug}`);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create community</DialogTitle>
          <DialogDescription>You will be the owner. You can change these later.</DialogDescription>
        </DialogHeader>
        <form id="create-community" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput control={form.control} name="name" label="Name" autoComplete="off" />
            <FormTextarea control={form.control} name="description" label="Description" rows={3} />
            <FormSelect
              control={form.control}
              name="access"
              label="Who can join"
              options={communityAccessOptions}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="submit" form="create-community" disabled={createCommunity.isPending}>
            {createCommunity.isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
