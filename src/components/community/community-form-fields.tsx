"use client";

import type { Control } from "react-hook-form";
import { FormInput, FormTextarea } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { FieldGroup } from "@/components/ui/field";
import { communityAccessOptions, type CreateCommunityInput } from "@/schemas/community";

/** Shared by the create dialog and the settings form. */
export function CommunityFormFields({ control }: { control: Control<CreateCommunityInput> }) {
  return (
    <FieldGroup>
      <FormInput control={control} name="name" label="Name" autoComplete="off" />
      <FormTextarea control={control} name="description" label="Description" rows={3} />
      <FormSelect
        control={control}
        name="access"
        label="Who can join"
        options={communityAccessOptions}
      />
    </FieldGroup>
  );
}
