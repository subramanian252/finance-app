"use client";

import { insertCategorySchema } from "@/app/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useDeleteCategory } from "../api/use-delete-category";
import { useEditCategoryMutation } from "../api/use-edit-category";
import { useGetCategory } from "../api/use-get-category";
import { useEditCategory } from "../hooks/useEditAccount";
import { CategoryForm } from "./CategoryForm";

const formSchema = insertCategorySchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export function EditCategorytSheet() {
  const [DialogModel, confirm] = useConfirm({
    title: "Delete",
    description: "Are you sure you want to delete?",
  });

  const { isOpen, onClose, id } = useEditCategory();

  const editMutation = useEditCategoryMutation(id);

  const deleteMutation = useDeleteCategory(id);

  const query = useGetCategory(id);

  const data = query.data;

  const defaultValues = {
    name: data?.name || "",
  };

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <DialogModel />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={"right"}>
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit your Category</SheetDescription>
          </SheetHeader>
          {query.isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              disabled={editMutation.isPending || deleteMutation.isPending}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
