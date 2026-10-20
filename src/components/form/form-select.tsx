"use client";

import type { FieldValues } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, type FormFieldProps } from "./form-field";

export type SelectOption = { value: string; label: string; description?: string };

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  placeholder,
}: FormFieldProps<T> & { options: SelectOption[]; placeholder?: string }) {
  return (
    <FormField control={control} name={name} label={label} description={description}>
      {(field, invalid) => (
        <Select items={options} value={field.value} onValueChange={field.onChange}>
          <SelectTrigger id={name} aria-invalid={invalid} className="w-full" onBlur={field.onBlur}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}
