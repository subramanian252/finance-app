"use client";

import { insertAccountSchema } from "@/app/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { z } from "zod";
import { UseCreateAccount } from "../api/use-create-account";
import { useNewAccount } from "../hooks/UseNewAccount";
import { AccountForm } from "./AccountForm";

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.infer<typeof formSchema>;

export function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();

  const mutation = UseCreateAccount();

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
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>Create a New Account</SheetDescription>
        </SheetHeader>
        <AccountForm
          defaultValues={{ name: "" }}
          onSubmit={onSubmit}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
}
