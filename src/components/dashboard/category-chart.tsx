"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Dashboard } from "@/schemas/dashboard";
import { seriesColor } from "./chart-color";

const config = { notes: { label: "Notes", theme: seriesColor } } satisfies ChartConfig;

export function CategoryChart({ categories }: { categories: Dashboard["categories"] }) {
  const data = categories.map((c) => ({ ...c, label: `${c.name} · ${c.community}` }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes per category</CardTitle>
        <CardDescription>Top categories across your communities</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState title="No notes yet" />
        ) : (
          <ChartContainer
            config={config}
            className="aspect-auto w-full"
            style={{ height: data.length * 36 + 16 }}
          >
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 32 }}>
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={false}
                width={160}
                tickFormatter={(value: string) => (value.length > 24 ? `${value.slice(0, 23)}…` : value)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="notes" />} />
              <Bar dataKey="notes" fill="var(--color-notes)" radius={[0, 4, 4, 0]} barSize={20}>
                <LabelList dataKey="notes" position="right" className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
