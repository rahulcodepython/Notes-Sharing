"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField } from "@/components/form/form-field";
import { FormInput } from "@/components/form/form-input";
import { CategoryCombobox } from "@/components/note/category-combobox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUploadNote } from "@/hooks/queries/use-notes";
import type { Category } from "@/schemas/category";
import { noteFormSchema, type NoteFormInput } from "@/schemas/note";

export function UploadNoteDialog({ slug, categories }: { slug: string; categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const upload = useUploadNote(slug);
  const form = useForm<NoteFormInput>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { title: "", categoryId: "" },
  });

  function onSubmit(values: NoteFormInput) {
    upload.mutate(values, {
      onSuccess: (note) => {
        toast.success(`"${note.title}" uploaded`);
        form.reset();
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !upload.isPending && setOpen(next)}>
      <DialogTrigger
        render={
          <Button>
            <UploadIcon /> Upload note
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload note</DialogTitle>
          <DialogDescription>
            The file is saved to the &quot;Notes Sharing&quot; folder in your Google Drive and shared
            with anyone who has the link.
          </DialogDescription>
        </DialogHeader>
        <form id="upload-note" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput control={form.control} name="title" label="Title" autoComplete="off" />
            <FormField control={form.control} name="categoryId" label="Category">
              {(field, invalid) => (
                <CategoryCombobox
                  slug={slug}
                  categories={categories}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={invalid}
                />
              )}
            </FormField>
            <FormField control={form.control} name="file" label="File">
              {(field, invalid) => (
                <Input
                  id="file"
                  type="file"
                  aria-invalid={invalid}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                    if (file && !form.getValues("title")) {
                      form.setValue("title", file.name.replace(/\.[^.]+$/, ""));
                    }
                  }}
                />
              )}
            </FormField>
          </FieldGroup>
        </form>
        {upload.isPending && (
          <div className="flex flex-col gap-1">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Uploading to Drive… {upload.progress}%</p>
          </div>
        )}
        <DialogFooter>
          <Button type="submit" form="upload-note" disabled={upload.isPending}>
            {upload.isPending ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
