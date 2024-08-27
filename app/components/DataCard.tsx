import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { IconType } from "react-icons/lib";
import { CountUp } from "@/components/ui/count-up";
import { formatPercentage } from "@/lib/new_utils";
import { Skeleton } from "@/components/ui/skeleton";

const boxVariant = cva("rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-green-500/20",
      danger: "bg-red-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const IconVariant = cva("w-6 h-6 shrink-0", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-green-500",
      danger: "fill-red-500",
      warning: "fill-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type boxVariant = VariantProps<typeof boxVariant>;
type IconVariant = VariantProps<typeof IconVariant>;

interface Props extends boxVariant, IconVariant {
  icon: IconType;
  title: string;
  value?: number;
  dateRangeLabel?: string;
  percentageChange?: number | undefined;
}

function DataCard(props: Props) {
  const {
    icon: Icon,
    title,
    value = 0,
    dateRangeLabel,
    percentageChange,
    variant,
  } = props;

  return (
    <Card className="border-none drop-shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-1">
          <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRangeLabel}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={IconVariant({ variant })} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-2xl line-clamp-1 break-all">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimalPlaces={2}
            decimals={2}
            formattingFn={formatCurrency}
          />
        </h1>
        <p
          className={cn(
            "text-muted-foreground text-sm line-clamp-1 mt-2",
            percentageChange ?? 0 > 0 ? "text-green-500" : "text-red-500"
          )}
        >
          {formatPercentage(percentageChange ?? 0, { addPrefix: true })} from
          last period
        </p>
      </CardContent>
    </Card>
  );
}

export const DataCardLoading = () => {
  return (
    <Card className="border-none drop-shadow-sm h-[192px]">
      <CardHeader className="flex flex-row items-center justify-between ">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mb-2" />
        <Skeleton className="shrink-0 h-4 w-40" />
      </CardContent>
    </Card>
  );
};

export default DataCard;
