"use client";

import { DataTable } from "@/app/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategory } from "@/features/category/api/use-bulk-delete-category";
import { useGetCategories } from "@/features/category/api/use-get-categories";
import { useNewCategory } from "@/features/category/hooks/UseNewAccount";
import { Loader2, Plus } from "lucide-react";
import { columns, ResponseType } from "./columns";

interface Props {}

function Page(props: Props) {
  const {} = props;

  const newAccount = useNewCategory();

  const categoriesQuery = useGetCategories();

  const categories = (categoriesQuery.data as ResponseType[]) || [];

  const deleteCategories = useBulkDeleteCategory();

  const isDisabled = deleteCategories.isPending;

  if (categoriesQuery.isLoading) {
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
          <CardTitle className="text-xl line-clamp-1">Category Page</CardTitle>
          <Button onClick={newAccount.onOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Add Now
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={categories}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategories.mutate({ ids });
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
