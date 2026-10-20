"use client";

import type { ComponentProps } from "react";
import type { FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, type FormFieldProps } from "./form-field";

type InputProps = Omit<ComponentProps<typeof Input>, "name" | "value" | "onChange" | "onBlur">;
type TextareaProps = Omit<ComponentProps<typeof Textarea>, "name" | "value" | "onChange" | "onBlur">;

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...props
}: FormFieldProps<T> & InputProps) {
  return (
    <FormField control={control} name={name} label={label} description={description}>
      {(field, invalid) => <Input {...props} {...field} id={name} aria-invalid={invalid} />}
    </FormField>
  );
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...props
}: FormFieldProps<T> & TextareaProps) {
  return (
    <FormField control={control} name={name} label={label} description={description}>
      {(field, invalid) => <Textarea {...props} {...field} id={name} aria-invalid={invalid} />}
    </FormField>
  );
}
