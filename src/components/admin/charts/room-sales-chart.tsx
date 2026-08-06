"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface RoomSalesChartProps {
  data: Array<{ name: string; bookings: number; revenue: number }>;
}

const COLORS = ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#3b82f6"];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; bookings: number; revenue: number } }>;
}) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="admin-card rounded-sm border px-3 py-2 text-xs shadow-lg">
        <p className="font-medium mb-0.5">{d.name}</p>
        <p className="opacity-60">{d.bookings} bookings</p>
        <p className="text-amber-500 font-semibold">£{d.revenue.toLocaleString("en-GB")}</p>
      </div>
    );
  }
  return null;
};

export function RoomSalesChart({ data }: RoomSalesChartProps) {
  const total = data.reduce((acc, d) => acc + d.bookings, 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-xs opacity-40">
        No booking data yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex-shrink-0" style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              dataKey="bookings"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2.5 min-w-0">
        {data.map((item, i) => {
          const pct = total > 0 ? Math.round((item.bookings / total) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center gap-2 min-w-0">
              <span
                className="shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-[11px] truncate opacity-70 flex-1">{item.name}</span>
              <span className="text-[11px] font-semibold shrink-0">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
