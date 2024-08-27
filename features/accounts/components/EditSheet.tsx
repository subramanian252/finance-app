"use client";

import { insertAccountSchema } from "@/app/db/schema";
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
import { useDeleteAccount } from "../api/use-delete-account";
import { useEditAccountMutation } from "../api/use-edit-account";
import { useGetAccount } from "../api/use-get-account";
import { useEditAccount } from "../hooks/useEditAccount";
import { AccountForm } from "./AccountForm";

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export function EditAccountSheet() {
  const [DialogModel, confirm] = useConfirm({
    title: "Delete",
    description: "Are you sure you want to delete?",
  });

  const { isOpen, onClose, id } = useEditAccount();

  const editMutation = useEditAccountMutation(id);

  const deleteMutation = useDeleteAccount(id);

  const query = useGetAccount(id);

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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit your Account</SheetDescription>
          </SheetHeader>
          {query.isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
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
