"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface OccupancyChartProps {
  data: Array<{ date: string; occupancy: number }>;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="admin-card rounded-sm border px-3 py-2 text-xs shadow-lg">
        <p className="opacity-60 mb-0.5">{label}</p>
        <p className="font-semibold text-emerald-500">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barSize={6}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "currentColor", opacity: 0.45 }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "currentColor", opacity: 0.45 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="occupancy" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.occupancy >= 80 ? "#10b981" : entry.occupancy >= 50 ? "#f59e0b" : "#6b7280"}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
