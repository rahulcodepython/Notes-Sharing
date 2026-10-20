"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useCreateCategory } from "@/hooks/queries/use-notes";
import type { Category } from "@/schemas/category";

// Synthetic option shown when the typed name does not exist yet.
const CREATE_ID = "__create__";

/** Pick a category, or type a new name and choose `Create "…"`. */
export function CategoryCombobox({
  slug,
  categories,
  value,
  onChange,
  invalid,
}: {
  slug: string;
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  invalid?: boolean;
}) {
  const createCategory = useCreateCategory(slug);
  const [input, setInput] = useState("");
  const typed = input.trim();
  const exists = categories.some((c) => c.name.toLowerCase() === typed.toLowerCase());
  const items: Category[] =
    typed && !exists ? [...categories, { id: CREATE_ID, name: typed }] : categories;
  const selected = categories.find((c) => c.id === value) ?? null;

  function onSelect(item: Category | null) {
    if (!item) return onChange("");
    if (item.id !== CREATE_ID) return onChange(item.id);
    createCategory.mutate(item.name, { onSuccess: (category) => onChange(category.id) });
  }

  return (
    <Combobox
      items={items}
      value={selected}
      onValueChange={onSelect}
      inputValue={input}
      onInputValueChange={setInput}
      itemToStringLabel={(item) => item.name}
      isItemEqualToValue={(a, b) => a.id === b.id}
    >
      <ComboboxInput
        placeholder="Choose or create a category"
        aria-invalid={invalid}
        disabled={createCategory.isPending}
        className="w-full"
      />
      <ComboboxContent>
        <ComboboxEmpty>Type a name to create a category</ComboboxEmpty>
        <ComboboxList>
          {(item: Category) => (
            <ComboboxItem key={item.id} value={item}>
              {item.id === CREATE_ID ? `Create "${item.name}"` : item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
