import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string) => void;
}

const requiredOptions = ["payee", "amount", "date"];

function TableHeadSelect(props: Props) {
  const { columnIndex, selectedColumns, onChange } = props;

  const currentSelectedColumn = selectedColumns[`column_${columnIndex}`];

  return (
    <Select
      value={currentSelectedColumn || ""}
      onValueChange={(value: any) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelectedColumn && "text-blue-600"
        )}
      >
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="skip">Skip</SelectItem>
          {requiredOptions.map((option) => {
            const isDisabled =
              Object.values(selectedColumns).includes(option) &&
              selectedColumns[`column_${columnIndex}`] !== option;
            return (
              <SelectItem
                key={option}
                value={option}
                className="capitalize"
                disabled={isDisabled}
              >
                {option}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default TableHeadSelect;
