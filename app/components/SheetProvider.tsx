import { EditAccountSheet } from "@/features/accounts/components/EditSheet";
import { NewAccountSheet } from "@/features/accounts/components/NewAccountSheet";
import { EditCategorytSheet } from "@/features/category/components/EditSheet";
import { NewCategorySheet } from "@/features/category/components/NewCategorySheet";
import { EditSheetTransaction } from "@/features/transactions/components/EditSheet";
import { NewTransactionSheet } from "@/features/transactions/components/NewTransactionSheet";
import React from "react";

interface Props {}

function SheetProvider(props: Props) {
  const {} = props;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorytSheet />

      <NewTransactionSheet />
      <EditSheetTransaction />
    </>
  );
}

export default SheetProvider;
