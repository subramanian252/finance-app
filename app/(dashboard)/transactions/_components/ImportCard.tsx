import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImportTable from "./ImportTable";
import { object } from "zod";
import { convertAmountToMilliUnits } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["payee", "amount", "date"];

interface Props {
  data: string[][];
  onCancel: () => void;
  onSubmit: (results: any) => void;
}
type SelectedColumnsState = {
  [key: string]: string | null;
};

function ImportCard(props: Props) {
  const {} = props;

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  );

  const headers = props.data[0];
  const body = props.data.slice(1);

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;

      return newSelectedColumns;
    });
  };

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        return selectedColumns[`column_${index}`] || null;
      }),
      body: body
        .map((row, i) => {
          const transformedRow = row.map((cell, index) => {
            return selectedColumns[`column_${index}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];

        if (header !== null) acc[header] = cell;

        return acc;
      }, {});
    });

    // format currency and date to match it with database
    const formattedData = arrayOfData.map((item) => ({
      ...item,
      amount: convertAmountToMilliUnits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat),
    }));

    props.onSubmit(formattedData);
  };

  return (
    <div className="-mt-24 max-w-screen-2xl mx-auto">
      <Card className="border-none drop-shadow-md">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction Page
          </CardTitle>
          <div className="flex gap-2 lg:flex-row flex-col items-center">
            <Button size={"sm"} variant={"secondary"} onClick={props.onCancel}>
              Cancel
            </Button>
            <Button
              size={"sm"}
              onClick={handleContinue}
              disabled={progress < requiredOptions.length}
            >
              {progress}/{requiredOptions.length} Continue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ImportCard;
