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
import { useGetCategories } from "@/features/category/api/use-get-categories";
import { z } from "zod";
import { UseCreateTransaction } from "../api/use-create-transaction";
import { UseNewTransaction } from "../hooks/UseNewTranscation";
import { UseCreateCategory } from "@/features/category/api/use-create-category";
import { TransactionForm } from "./TransactionForm";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({ id: true });

type FormValues = z.infer<typeof formSchema>;

export function NewTransactionSheet() {
  const { isOpen, onClose } = UseNewTransaction();

  const createMutation = UseCreateTransaction();

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

  const disabled =
    createMutation.isPending ||
    accountMutation.isPending ||
    categoryMutation.isPending;

  const isLoading = accountQuery.isLoading || categoriesQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a New Transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            accountOptions={accountOptions || []}
            categoryOptions={categoryOptions || []}
            createAccount={onCreateAccount}
            createCategory={onCreateCategory}
            disabled={disabled}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
