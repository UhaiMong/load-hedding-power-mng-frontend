"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatStat, humanizeKey, parseStats, rowLabel, type Bars, type RowTable, type Tile } from "@/lib/stats";

// single-series bars: one hue, stepped per mode
const config = { value: { label: "Value", theme: { light: "#2a78d6", dark: "#3987e5" } } } satisfies ChartConfig;

export function StatTiles({ tiles }: { tiles: Tile[] }) {
  if (!tiles.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg bg-background p-4 ring-1 ring-foreground/10">
          <p className="text-xs text-muted-foreground">{t.label}</p>
          <p className="mt-1 text-2xl font-semibold">{formatStat(t.key, t.value)}</p>
        </div>
      ))}
    </div>
  );
}

export function BarCard({ title, data, valueLabel = "Count" }: Bars & { valueLabel?: string }) {
  const height = Math.max(160, data.length * 36);
  return (
    <section className="rounded-lg bg-background p-4 ring-1 ring-foreground/10">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No data for this period.</p>
      ) : (
        <ChartContainer config={{ value: { ...config.value, label: valueLabel } }} className="aspect-auto w-full" style={{ height }}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }} barCategoryGap={6}>
            <CartesianGrid horizontal={false} strokeOpacity={0.4} />
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={{ fillOpacity: 0.08 }} content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} maxBarSize={22} />
          </BarChart>
        </ChartContainer>
      )}
    </section>
  );
}

/** Chart of one metric (switchable) + full table of every metric. */
export function TableCard({ table }: { table: RowTable }) {
  const [metric, setMetric] = useState(table.metrics[0]);
  const data = table.rows.map((r) => ({ name: rowLabel(r, table.labelKey), value: Number(r[metric] ?? 0) }));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{table.title}</h3>
        {table.metrics.length > 1 && (
          <Select className="w-auto" value={metric} onChange={(e) => setMetric(e.target.value)} options={table.metrics.map((m) => ({ value: m, label: humanizeKey(m) }))} />
        )}
      </div>
      <BarCard title={humanizeKey(metric)} data={data} valueLabel={humanizeKey(metric)} />
      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{humanizeKey(table.labelKey)}</TableHead>
              {table.metrics.map((m) => (
                <TableHead key={m} className="text-right">{humanizeKey(m)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{rowLabel(r, table.labelKey)}</TableCell>
                {table.metrics.map((m) => (
                  <TableCell key={m} className="text-right">{formatStat(m, Number(r[m] ?? 0))}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/** Renders any stats payload: tiles, bar groups, then tables. */
export function StatsView({ data }: { data: unknown }) {
  const { tiles, bars, tables } = parseStats(data);
  if (!tiles.length && !bars.length && !tables.length)
    return <p className="p-6 text-center text-sm text-muted-foreground">No data for this period.</p>;
  return (
    <div className="space-y-5">
      <StatTiles tiles={tiles} />
      {bars.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {bars.map((b) => (
            <BarCard key={b.title} {...b} />
          ))}
        </div>
      )}
      {tables.map((t) => (
        <TableCard key={t.title} table={t} />
      ))}
    </div>
  );
}
