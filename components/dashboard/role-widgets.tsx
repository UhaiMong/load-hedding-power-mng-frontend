"use client";

import Link from "next/link";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { SCHEDULE_TYPE_TONES } from "@/lib/enums";
import { fmtDate, fmtTime, todayISO } from "@/lib/format";
import type { Query } from "@/lib/api";
import type { Schedule } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { StatsView } from "./stats-view";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

/** Tile showing `meta.total` of a list endpoint. */
function CountTile({ label, path, query, href }: { label: string; path: string; query?: Query; href: string }) {
  const q = useApi<unknown[]>(path, { ...query, page: 1, limit: 1 });
  return (
    <Link href={href} className="rounded-lg bg-background p-4 ring-1 ring-foreground/10 hover:bg-muted">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{q.isPending ? "…" : q.isError ? "—" : (q.data?.meta?.total ?? 0)}</p>
    </Link>
  );
}

export function AdminWidgets() {
  const q = useApi<unknown>("admin/dashboard-stats");
  return (
    <QueryState query={q}>
      <StatsView data={q.data?.data} />
    </QueryState>
  );
}

export function StaffWidgets() {
  const q = useApi<unknown>("analytics/outage-summary", { from: daysAgo(30), to: todayISO() });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <CountTile label="New reports to verify" path="outages" query={{ status: "REPORTED" }} href="/admin/outages" />
        <CountTile label="Verified, unassigned" path="outages" query={{ status: "VERIFIED" }} href="/admin/outages" />
        <CountTile label="Upcoming schedules" path="schedules" query={{ status: "SCHEDULED", from: todayISO() }} href="/admin/schedules" />
      </div>
      <h2 className="font-semibold">Last 30 days</h2>
      <QueryState query={q}>
        <StatsView data={q.data?.data} />
      </QueryState>
    </div>
  );
}

export function TechnicianWidgets() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <CountTile label="Assigned to me" path="outages/my-assigned" query={{ status: "ASSIGNED" }} href="/admin/outages" />
      <CountTile label="In progress" path="outages/my-assigned" query={{ status: "IN_PROGRESS" }} href="/admin/outages" />
      <CountTile label="Restored" path="outages/my-assigned" query={{ status: "RESTORED" }} href="/admin/outages" />
    </div>
  );
}

export function CustomerWidgets() {
  const upcoming = useApi<Schedule[]>("schedules", { status: "SCHEDULED", from: todayISO(), sortBy: "startTime", order: "asc", page: 1, limit: 5 });
  const rows = upcoming.data?.data ?? [];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <CountTile label="Unpaid bills" path="bills" query={{ status: "UNPAID" }} href="/admin/bills" />
        <CountTile label="My outage reports" path="outages/my-reports" href="/admin/outages" />
      </div>
      <section className="rounded-lg bg-background p-4 ring-1 ring-foreground/10">
        <h2 className="mb-3 font-semibold">Upcoming power cuts</h2>
        <QueryState query={upcoming} empty={rows.length === 0} emptyMessage="No scheduled power cuts. 🎉">
          <ul className="divide-y text-sm">
            {rows.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span>
                  <span className="font-medium">{fmtDate(s.startTime)}</span> · {fmtTime(s.startTime)} – {fmtTime(s.endTime)}
                  <span className="text-muted-foreground"> · {s.feeder?.name}</span>
                </span>
                <EnumBadge value={s.type} tones={SCHEDULE_TYPE_TONES} />
              </li>
            ))}
          </ul>
        </QueryState>
      </section>
    </div>
  );
}
