"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { insertTransactionSchema } from "@/app/db/schema";
import { Trash } from "lucide-react";
import SelectComponent from "@/app/components/SelectComponent";
import { DatePicker } from "@/app/components/DatePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactCurrencyInput from "@/app/components/ReactCurrencyInput";
import { convertAmountToMilliUnits } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  amount: z.string(),
  payee: z.string(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({ id: true });

type apiValues = z.infer<typeof apiSchema>;

type FormValues = z.infer<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: apiValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  createAccount: (name: string) => void;
  createCategory: (name: string) => void;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
};

export function TransactionForm({
  disabled,
  onSubmit,
  defaultValues,
  onDelete,
  id,
  createAccount,
  createCategory,
  accountOptions,
  categoryOptions,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const amountToMilliUnits = convertAmountToMilliUnits(amount);
    onSubmit({ ...values, amount: amountToMilliUnits });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 mt-4"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Date</FormLabel>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <SelectComponent
                  placeholder="Select an account"
                  options={accountOptions}
                  disabled={disabled}
                  value={field.value}
                  onCreate={createAccount}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <SelectComponent
                  placeholder="Select a category"
                  options={categoryOptions}
                  disabled={disabled}
                  value={field.value}
                  onCreate={createCategory}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />

          <FormField
            name="payee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payee</FormLabel>
                <Input
                  placeholder="Add a Payee"
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormItem>
            )}
          />
          <FormField
            name="notes"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  placeholder="Add a Note"
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormItem>
            )}
          />

          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <ReactCurrencyInput
                  {...field}
                  placeHolder={"0.00"}
                  disabled={disabled}
                />
              </FormItem>
            )}
          />

          <div className="flex flex-col justify-end space-y-2 mt-10">
            <Button disabled={disabled} className="w-full">
              {id ? "Update" : "Create"}
            </Button>
            {!!id && (
              <Button
                disabled={disabled}
                type="button"
                className="w-full"
                onClick={handleDelete}
                variant={"destructive"}
              >
                <Trash className="h-4 w-4 mr-2" />
                <p>Delete Transaction</p>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
