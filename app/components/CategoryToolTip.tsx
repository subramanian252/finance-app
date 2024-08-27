import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

interface Props {}

function CategoryTooltip(props: any) {
  const { active, payload } = props;

  if (!active) {
    return null;
  }

  const name = payload[0].payload.name;
  const value = payload[0].value;

  return (
    <div className="rounded-sm bg-white border shadow-sm overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {name}
      </div>
      <Separator />
      <div className="flex items-center justify-between gap-x-4 p-2 px-3">
        <div className="flex items-center gap-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />

          <p className="text-muted-foreground text-sm">Expenses</p>
          <p className="text-sm font-medium text-right">
            {formatCurrency(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CategoryTooltip;
