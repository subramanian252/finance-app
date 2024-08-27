"use client";

import { insertTransactionSchema } from "@/app/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UseCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { UseCreateCategory } from "@/features/category/api/use-create-category";
import { useGetCategories } from "@/features/category/api/use-get-categories";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useEditTransactionMutation } from "../api/use-edit-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { useEditTransaction } from "../hooks/useEditTransaction";
import { TransactionForm } from "./TransactionForm";

const formSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.infer<typeof formSchema>;

export function EditSheetTransaction() {
  const [DialogModel, confirm] = useConfirm({
    title: "Delete",
    description: "Are you sure you want to delete?",
  });

  const { isOpen, onClose, id } = useEditTransaction();

  const editMutation = useEditTransactionMutation(id);

  const deleteMutation = useDeleteTransaction(id);

  const query = useGetTransaction(id);

  const data = query.data;

  console.log(data);

  const accountMutation = UseCreateAccount();

  const accountQuery = useGetAccounts();

  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };

  const accountOptions = accountQuery.data?.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const categoriesQuery = useGetCategories();

  const categoryMutation = UseCreateCategory();

  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name });
  };

  const categoryOptions = categoriesQuery.data?.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const isDisabled =
    editMutation.isPending ||
    accountMutation.isPending ||
    categoryMutation.isPending ||
    deleteMutation.isPending ||
    query.isLoading;

  const defaultValues = {
    amount: data?.amount.toString() || "",
    payee: data?.payee || "",
    date: new Date(data?.date || new Date()),
    categoryId: data?.categoryId || "",
    notes: data?.notes || "",
    accountId: data?.accountId || "",
  };

  const onSubmit = (values: FormValues) => {
    console.log("running", values);
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
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit your Transaction</SheetDescription>
          </SheetHeader>
          {query.isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              disabled={isDisabled}
              onDelete={onDelete}
              accountOptions={accountOptions || []}
              categoryOptions={categoryOptions || []}
              createAccount={onCreateAccount}
              createCategory={onCreateCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
