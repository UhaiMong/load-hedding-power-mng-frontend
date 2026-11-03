"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { OUTAGE_STATUS_TONES, SEVERITY_TONES } from "@/lib/enums";
import { fmtDateTime } from "@/lib/format";
import type { Outage } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { imageOf, reporterOf, startedOf, technicianOf } from "../_components/helpers";
import { OutageActions } from "../_components/outage-actions";
import { Timeline } from "../_components/timeline";

export default function OutageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const q = useApi<Outage>(`outages/${id}`);
  const o = q.data?.data;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/admin/outages" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to outages
      </Link>

      <QueryState query={q}>
        {o && user && (
          <>
            <section className="space-y-4 rounded-lg bg-background p-5 ring-1 ring-foreground/10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold">{o.area?.name ?? "Outage"}</h1>
                  <p className="text-sm text-muted-foreground">Reported {fmtDateTime(startedOf(o))}</p>
                </div>
                <div className="flex gap-2">
                  {o.severity && <EnumBadge value={o.severity} tones={SEVERITY_TONES} />}
                  <EnumBadge value={o.status} tones={OUTAGE_STATUS_TONES} />
                </div>
              </div>

              {o.description && <p className="text-sm">{o.description}</p>}
              {imageOf(o) && (
                <a href={imageOf(o)!} target="_blank" rel="noreferrer">
                  <img src={imageOf(o)!} alt="Outage photo" className="max-h-64 rounded-md object-cover" />
                </a>
              )}

              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <Item label="Area code" value={o.area?.code} />
                <Item label="Feeder" value={o.area?.feeder?.name ?? o.feeder?.name} />
                <Item label="Reported by" value={reporterOf(o)?.name} />
                <Item label="Technician" value={technicianOf(o)?.name} />
                <Item label="Cause" value={o.cause} />
                <Item label="Estimated restoration" value={o.estimatedRestorationAt && fmtDateTime(o.estimatedRestorationAt)} />
                <Item label="Restored at" value={o.restoredAt && fmtDateTime(o.restoredAt)} />
                {o.rejectReason && <Item label="Rejection reason" value={o.rejectReason} />}
              </dl>

              <OutageActions outage={o} role={user.role} />
            </section>

            <Timeline id={o.id} />
          </>
        )}
      </QueryState>
    </div>
  );
}

function Item({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}
