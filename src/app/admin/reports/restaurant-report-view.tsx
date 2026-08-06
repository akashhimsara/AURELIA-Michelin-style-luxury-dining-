"use client";

import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { Utensils, Wine } from "lucide-react";
import type { TopDishRow } from "@/features/admin/actions/reports";

interface RestaurantReportViewProps {
  topDishes: TopDishRow[];
  seatingSlots: Array<{ slot: string; covers: number }>;
}

export function RestaurantReportView({ topDishes, seatingSlots }: RestaurantReportViewProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dishes Revenue Bar Chart */}
        <div className="admin-card rounded-sm border p-6 space-y-4">
          <div className="border-b border-current/5 pb-3">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Culinary Analytics</p>
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Utensils size={15} className="text-amber-500" /> Top Selling Dishes & Fine Wines (£)
            </h2>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topDishes} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.07} />
                <XAxis type="number" tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `£${v}`} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", borderRadius: "4px" }}
                  formatter={(value: any) => [
                    `£${typeof value === "number" ? value.toLocaleString("en-GB") : String(value ?? 0)}`,
                    "Revenue"
                  ]}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seating Slot Covers Bar Chart */}
        <div className="admin-card rounded-sm border p-6 space-y-4">
          <div className="border-b border-current/5 pb-3">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Dining Room Occupancy</p>
            <h2 className="text-sm font-semibold">Covers Served per Seating Time Slot</h2>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seatingSlots} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.07} />
                <XAxis dataKey="slot" tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", borderRadius: "4px" }}
                  formatter={(value: any) => [
                    `${value ?? 0} Guests`,
                    "Covers"
                  ]}
                />
                <Bar dataKey="covers" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
