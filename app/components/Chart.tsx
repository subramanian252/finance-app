import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  BarChart,
  FileSearch,
  LineChart,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import AreaVariant from "./AreaVariant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BarVariant from "./BarVariant";
import LineVariant from "./LineVariant";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

function Chart(props: Props) {
  const { data = [] } = props;

  const [variant, setVariant] = useState("area");

  const onVariantChange = (value: string) => {
    setVariant(value);
  };

  return (
    <Card className="border-none drop-shadow-md">
      <CardHeader className="flex flex-row lg:items-center justify-between space-y-2">
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>
        <Select defaultValue="area" onValueChange={onVariantChange}>
          <SelectTrigger className="w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center p-2">
                <AreaChart className="w-4 h-4 mr-2" />
                <p className="text-sm shrink-0">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center p-2">
                <BarChart className="w-4 h-4 mr-2" />
                <p className="text-sm shrink-0">Bar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center p-2">
                <LineChart className="w-4 h-4 mr-2" />
                <p className="text-sm shrink-0">Line Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-y-4 h-[350px] w-full">
            <FileSearch className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data for this Period
            </p>
          </div>
        ) : (
          <div>
            {variant === "area" && <AreaVariant data={data} />}
            {variant === "bar" && <BarVariant data={data} />}
            {variant === "line" && <LineVariant data={data} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Chart;

export const ChartLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-full lg:w-[120px]" />
      </CardHeader>

      <CardContent>
        <div className="flex h-[350px] w-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </div>
      </CardContent>
    </Card>
  );
};
