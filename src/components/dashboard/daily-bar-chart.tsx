"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Dashboard } from "@/schemas/dashboard";
import { seriesColor } from "./chart-color";

const shortDate = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
const formatDay = (date: string) => shortDate.format(new Date(date));

/** One count per day over the activity window. */
export function DailyBarChart({
  title,
  description,
  data,
  metric,
  label,
}: {
  title: string;
  description: string;
  data: Dashboard["activity"];
  metric: "notes" | "downloads";
  label: string;
}) {
  const config = { [metric]: { label, theme: seriesColor } } satisfies ChartConfig;
  const total = data.reduce((sum, day) => sum + day[metric], 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}: {total.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-56 w-full">
          <BarChart data={data} margin={{ left: -20, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatDay}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={(value) => formatDay(String(value))} />}
            />
            <Bar dataKey={metric} fill={`var(--color-${metric})`} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
