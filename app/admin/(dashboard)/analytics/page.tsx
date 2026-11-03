"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { QueryState } from "@/components/common/states";
import { StatsView } from "@/components/dashboard/stats-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { todayISO } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const PRESETS = [
  { label: "7 days", from: () => daysAgo(7) },
  { label: "30 days", from: () => daysAgo(30) },
  { label: "This year", from: () => `${new Date().getFullYear()}-01-01` },
  { label: "1 year", from: () => daysAgo(365) },
];

const SECTIONS = [
  { path: "analytics/outage-summary", title: "Outage summary", limit: false },
  { path: "analytics/area-reliability", title: "Area reliability", limit: true },
  { path: "analytics/technician-performance", title: "Technician performance", limit: true },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState({ from: daysAgo(30), to: todayISO() });

  return (
    <>
      <PageHeader title="Analytics" description="Outages, reliability and technician performance" />

      {/* one filter row for every chart below */}
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg bg-background p-3 ring-1 ring-foreground/10">
        {PRESETS.map((p) => {
          const from = p.from();
          return (
            <Button
              key={p.label}
              size="lg"
              variant="outline"
              className={cn(range.from === from && range.to === todayISO() && "border-primary text-primary")}
              onClick={() => setRange({ from, to: todayISO() })}
            >
              {p.label}
            </Button>
          );
        })}
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          From <Input type="date" className="w-auto" value={range.from} max={range.to} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} />
        </label>
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          To <Input type="date" className="w-auto" value={range.to} min={range.from} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} />
        </label>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((s) => (
          <Section key={s.path} {...s} range={range} />
        ))}
      </div>
    </>
  );
}

function Section({ path, title, limit, range }: { path: string; title: string; limit: boolean; range: { from: string; to: string } }) {
  const q = useApi<unknown>(path, { ...range, limit: limit ? 10 : undefined });
  return (
    <section>
      <h2 className="mb-3 font-semibold">{title}</h2>
      <QueryState query={q}>
        <StatsView data={q.data?.data} />
      </QueryState>
    </section>
  );
}
