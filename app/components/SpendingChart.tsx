import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSearch, Loader2, PieChart, Radar, Target } from "lucide-react";
import { useState } from "react";

import PieVariant from "./PieVariant";
import RadarVariant from "./RadarVariant";
import RadialVariant from "./RadialVariant";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

function SpendingChart(props: Props) {
  const { data = [] } = props;

  const [variant, setVariant] = useState("pie");

  const onVariantChange = (value: string) => {
    setVariant(value);
  };

  return (
    <Card className="border-none drop-shadow-md">
      <CardHeader className="flex flex-row lg:items-center justify-between space-y-2">
        <CardTitle className="text-xl line-clamp-1">Categories</CardTitle>
        <Select defaultValue="pie" onValueChange={onVariantChange}>
          <SelectTrigger className="w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center p-2">
                <PieChart className="w-4 h-4 mr-2" />
                <p className="text-sm shrink-0">Pie Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center p-2">
                <Radar className="w-4 h-4 mr-2" />
                <p className="text-sm shrink-0">Radar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center p-2">
                <Target className="w-4 h-4 mr-2" />
                <p className="text-sm shrink-0">Radial Chart</p>
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
            {variant === "pie" && <PieVariant data={data} />}
            {variant === "radar" && <RadarVariant data={data} />}
            {variant === "radial" && <RadialVariant data={data} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SpendingChart;

export const SpendingPieLoading = () => {
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
