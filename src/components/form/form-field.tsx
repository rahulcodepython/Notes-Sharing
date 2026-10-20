"use client";

import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

export type FormFieldProps<T extends FieldValues, N extends FieldPath<T> = FieldPath<T>> = {
  control: Control<T>;
  name: N;
  label: string;
  description?: string;
};

/** Label + control + description + error, wired to react-hook-form. Base for every form input. */
export function FormField<T extends FieldValues, N extends FieldPath<T>>({
  control,
  name,
  label,
  description,
  children,
}: FormFieldProps<T, N> & {
  children: (field: ControllerRenderProps<T, N>, invalid: boolean) => ReactNode;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {children(field, fieldState.invalid)}
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
