"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/new_utils";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

import DataCard, { DataCardLoading } from "./DataCard";

interface Props {}

function DataGrid(props: Props) {
  const {} = props;

  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;
  const accountId = params.get("accountId") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRangeLabel={dateRangeLabel}
      />
      <DataCard
        title="income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRangeLabel={dateRangeLabel}
      />
      <DataCard
        title="expense"
        value={data?.expenseAmount}
        percentageChange={data?.expenseChange}
        icon={FaArrowTrendDown}
        variant="default"
        dateRangeLabel={dateRangeLabel}
      />
    </div>
  );
}

export default DataGrid;
