import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoIcon, MinusCircle, PlusCircle, PlusIcon } from "lucide-react";
import React from "react";

interface Props {
  value: string;
  onChange: (value: string | undefined) => void;
  placeHolder?: string;
  disabled?: boolean;
}

import CurrencyInput from "react-currency-input-field";

function ReactCurrencyInput(props: Props) {
  const { value, onChange } = props;

  const parsedFloat = parseFloat(value);

  const isIncome = parsedFloat > 0;
  const isExpense = parsedFloat < 0;

  const onReverse = () => {
    if (!value) return;
    onChange((parseFloat(value) * -1).toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={onReverse}
              disabled={props.disabled}
              type="button"
              className={cn(
                "bg-slate-400 p-2 rounded-md absolute left-1.5 top-1.5",
                isIncome && "bg-emerald-500 hover:bg-emerald-600",
                isExpense && "bg-rose-500 hover:bg-rose-600"
              )}
            >
              {!parsedFloat && <InfoIcon className="size-3 text-white" />}
              {isIncome && <PlusCircle className="size-3 text-white" />}

              {isExpense && <MinusCircle className="size-3 text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>Use [+] for income, [-] for expense</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        prefix="$"
        className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={props.placeHolder}
        value={value}
        decimalsLimit={2}
        decimalScale={2}
        disabled={props.disabled}
        onValueChange={onChange}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        {isIncome && "This is an income"}
        {isExpense && "This is an expense"}
      </p>
    </div>
  );
}

export default ReactCurrencyInput;
