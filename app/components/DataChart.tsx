import { useGetSummary } from "@/features/summary/api/use-get-summary";
import React from "react";
import Chart, { ChartLoading } from "./Chart";
import SpendingChart, { SpendingPieLoading } from "./SpendingChart";

interface Props {}

function DataChart(props: Props) {
  const {} = props;

  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days as any} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingChart data={data?.categories as any} />
      </div>
    </div>
  );
}

export default DataChart;
