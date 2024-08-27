import { format } from "date-fns";
import React from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

function LineVariant(props: Props) {
  const { data } = props;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
        <Line
          dot={false}
          dataKey="income"
          stroke="#3d82f6"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <Line
          dot={false}
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineVariant;
