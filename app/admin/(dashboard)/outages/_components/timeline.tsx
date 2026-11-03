"use client";

import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { OUTAGE_STATUS_TONES } from "@/lib/enums";
import { fmtDateTime } from "@/lib/format";
import type { TimelineEvent } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function Timeline({ id }: { id: string }) {
  const q = useApi<TimelineEvent[]>(`outages/${id}/timeline`);
  const events = q.data?.data ?? [];

  return (
    <section className="rounded-lg bg-background p-5 ring-1 ring-foreground/10">
      <h2 className="mb-4 font-semibold">Timeline</h2>
      <QueryState query={q} empty={events.length === 0} emptyMessage="No updates yet.">
        <ol className="space-y-4 border-l pl-5">
          {events.map((e) => {
            const label = e.status ?? e.action;
            const who = e.actor ?? e.user ?? e.changedBy;
            const note = e.notes ?? e.note ?? e.message;
            return (
              <li key={e.id} className="relative">
                <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full bg-primary" />
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {label && <EnumBadge value={label} tones={OUTAGE_STATUS_TONES} />}
                  <span className="text-xs text-muted-foreground">{fmtDateTime(e.createdAt)}</span>
                  {who && <span className="text-xs text-muted-foreground">by {who.name}</span>}
                </div>
                {note && <p className="mt-1 text-sm">{note}</p>}
              </li>
            );
          })}
        </ol>
      </QueryState>
    </section>
  );
}
