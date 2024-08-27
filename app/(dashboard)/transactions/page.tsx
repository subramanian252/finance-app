"use client";

import { DataTable } from "@/app/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { UseNewTransaction } from "@/features/transactions/hooks/UseNewTranscation";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import ImportCard from "./_components/ImportCard";
import UploadButton from "./_components/UploadButton";
import { columns, ResponseType } from "./columns";

import { transactions as transactionsSchema } from "@/app/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transaction";
import { toast } from "sonner";

interface Props {}

const INITIAL_IMPORT_RESULTS = {
  errors: [],
  data: [],
  meta: {},
};

function Page(props: Props) {
  const {} = props;

  const [variant, setVariant] = useState<"LIST" | "CSV">("LIST");

  const [results, setResults] = useState(INITIAL_IMPORT_RESULTS);

  const [DialogModel, confirm] = useSelectAccount();

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setVariant("CSV");
    setResults(results);
  };

  const newTransaction = UseNewTransaction();

  const transactionsQuery = useGetTransactions();

  const transactions = (transactionsQuery.data as ResponseType[]) || [];

  const deleteTransactions = useBulkDeleteTransactions();

  const createBulkTransaction = useBulkCreateTransactions();

  const isDisabled = deleteTransactions.isPending;

  const onSubmit = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();

    if (!accountId) return toast.error("No account selected");

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createBulkTransaction.mutate(data, {
      onSuccess: () => {
        setVariant("LIST");
      },
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="-mt-24 max-w-screen-2xl mx-auto">
        <Card className="border-none drop-shadow-md h-96 p-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className=" h-full flex items-center justify-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        </Card>
      </div>
    );
  }

  if (variant === "CSV") {
    return (
      <>
        <DialogModel />
        <ImportCard
          data={results.data}
          onCancel={() => setVariant("LIST")}
          onSubmit={onSubmit}
        />
      </>
    );
  }

  return (
    <div className="-mt-24 max-w-screen-2xl mx-auto">
      <Card className="border-none drop-shadow-md">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction Page
          </CardTitle>
          <div className="flex gap-2 lg:flex-row flex-col items-center">
            <UploadButton onUpload={onUpload} />
            <Button onClick={newTransaction.onOpen} size={"sm"}>
              <Plus className="mr-2 h-4 w-4" />
              Add Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
            filterKey={"payee"}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
