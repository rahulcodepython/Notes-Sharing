"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CommunityFormFields } from "@/components/community/community-form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateCommunity } from "@/hooks/queries/use-community-settings";
import {
  updateCommunitySchema,
  type CommunitySettings,
  type UpdateCommunityInput,
} from "@/schemas/community";

export function DetailsCard({
  slug,
  details,
}: {
  slug: string;
  details: CommunitySettings["details"];
}) {
  const update = useUpdateCommunity(slug);
  const form = useForm<UpdateCommunityInput>({
    resolver: zodResolver(updateCommunitySchema),
    defaultValues: { ...details, description: details.description ?? "" },
  });

  function onSubmit(values: UpdateCommunityInput) {
    update.mutate(values, {
      onSuccess: () => {
        toast.success("Community updated");
        form.reset(values);
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>The URL stays the same when you rename.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="community-details" onSubmit={form.handleSubmit(onSubmit)}>
          <CommunityFormFields control={form.control} />
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          type="submit"
          form="community-details"
          disabled={update.isPending || !form.formState.isDirty}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
