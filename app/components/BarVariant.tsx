import { format } from "date-fns";
import React from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import CustomToolTip from "./CustomToolTip";

interface Props {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
}

function BarVariant(props: Props) {
  const { data } = props;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => format(new Date(v), "MMM dd")}
          style={{ fontSize: "10px" }}
          tickMargin={10}
        />
        <Tooltip content={<CustomToolTip />} />
        <Bar dataKey="income" fill="#3d82f6" className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarVariant;
