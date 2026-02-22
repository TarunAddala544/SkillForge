"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface CategoryData {
  categoryId: string;
  categoryName: string;
  totalMinutes: number;
}

interface Props {
  data: CategoryData[];
}

export default function CategoryChart({ data }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">
        Category Breakdown
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              stroke="#e5e5e5"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="categoryName"
              tick={{ fill: "#525252", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#525252", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e5e5",
              }}
              formatter={(value: number) =>
                `${value.toLocaleString()} mins`
              }
            />

            <Bar
              dataKey="totalMinutes"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}