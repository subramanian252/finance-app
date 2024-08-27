"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNewAccount } from "@/features/accounts/hooks/UseNewAccount";
import { columns, ResponseType } from "./columns";
import { DataTable } from "@/app/components/DataTable";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDelete } from "@/features/accounts/api/use-bulk-delete";

interface Props {}

function Page(props: Props) {
  const {} = props;

  const newAccount = useNewAccount();

  const accountsQuery = useGetAccounts();

  const accounts = (accountsQuery.data as ResponseType[]) || [];

  const deleteAccounts = useBulkDelete();

  const isDisabled = deleteAccounts.isPending;

  if (accountsQuery.isLoading) {
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

  return (
    <div className="-mt-24 max-w-screen-2xl mx-auto">
      <Card className="border-none drop-shadow-md">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <Button onClick={newAccount.onOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Add Now
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={accounts}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
            filterKey={"name"}
            columns={columns}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
