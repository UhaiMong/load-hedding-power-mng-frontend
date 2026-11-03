"use client";

import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { SCHEDULE_STATUS_TONES, SCHEDULE_TYPE_TONES } from "@/lib/enums";
import { fmtDateTime } from "@/lib/format";
import type { Schedule } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function ViewDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const q = useApi<Schedule>(`schedules/${id}`);
  const s = q.data?.data;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Schedule details">
      <QueryState query={q}>
        {s && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Item label="Feeder" value={s.feeder ? `${s.feeder.name} (${s.feeder.code})` : "—"} />
            <Item label="Substation" value={s.feeder?.substation?.name} />
            <Item label="Zone" value={s.feeder?.substation?.zone?.name} />
            <Item label="Type" value={<EnumBadge value={s.type} tones={SCHEDULE_TYPE_TONES} />} />
            <Item label="Start" value={fmtDateTime(s.startTime)} />
            <Item label="End" value={fmtDateTime(s.endTime)} />
            <Item label="Status" value={<EnumBadge value={s.status} tones={SCHEDULE_STATUS_TONES} />} />
            <Item label="Created by" value={s.createdBy?.name} />
            <Item label="Reason" value={s.reason} full />
            {s.cancelReason && <Item label="Cancel reason" value={s.cancelReason} full />}
          </dl>
        )}
      </QueryState>
    </Dialog>
  );
}

function Item({ label, value, full }: { label: string; value?: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}
