"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewCategory } from "../hooks/UseNewAccount";
import { insertCategorySchema } from "@/app/db/schema";
import { z } from "zod";
import { UseCreateCategory } from "../api/use-create-category";
import { CategoryForm } from "./CategoryForm";

const formSchema = insertCategorySchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export function NewCategorySheet() {
  const { isOpen, onClose } = useNewCategory();

  const mutation = UseCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>Create a New Category</SheetDescription>
        </SheetHeader>
        <CategoryForm
          defaultValues={{ name: "" }}
          onSubmit={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
}
