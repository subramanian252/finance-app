import { format } from "date-fns";
import React from "react";

import {
  Area,
  AreaChart,
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

function AreaVariant(props: Props) {
  const { data } = props;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3d82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => format(new Date(v), "MMM dd")}
          style={{ fontSize: "10px" }}
          tickMargin={10}
        />
        <Tooltip content={<CustomToolTip />} />
        <Area
          type="monotone"
          dataKey="income"
          stackId={"income"}
          stroke="#3d82f6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#income)"
          className="drop-shadow-sm"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId={"expenses"}
          stroke="#f43f5e"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#expenses)"
          className="drop-shadow-sm"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AreaVariant;
