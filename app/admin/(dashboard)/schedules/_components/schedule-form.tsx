"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { api } from "@/lib/api";
import { SCHEDULE_TYPES, toOptions } from "@/lib/enums";
import { fromLocalInput, toLocalInput } from "@/lib/format";
import type { Schedule } from "@/lib/types";
import { useOptions } from "@/lib/use-options";

/** Create a planned outage, or reschedule an existing one. */
export function ScheduleForm({ row, onClose }: { row?: Schedule; onClose: () => void }) {
  const feeders = useOptions(row ? undefined : "feeders");
  const [form, setForm] = useState({
    feederId: "",
    type: "MAINTENANCE",
    startTime: toLocalInput(row?.startTime),
    endTime: toLocalInput(row?.endTime),
    reason: row?.reason ?? "",
  });

  const save = useMutation({
    mutationFn: () => {
      const times = { startTime: fromLocalInput(form.startTime), endTime: fromLocalInput(form.endTime), reason: form.reason.trim() || undefined };
      return row
        ? api.patch(`schedules/${row.id}`, times)
        : api.post("schedules", { ...times, feederId: form.feederId, type: form.type });
    },
    onSuccess: onClose,
    meta: { success: row ? "Schedule updated" : "Planned outage created", invalidates: [["schedules"]] },
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const err = (n: string) => save.error?.fieldError(n);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(form.endTime) <= new Date(form.startTime)) return void toast.error("End time must be after start time");
    save.mutate();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title={row ? "Reschedule" : "New planned outage"} description="Overlapping schedules on the same feeder are rejected.">
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        {!row && (
          <>
            <FormField label="Feeder" error={err("feederId")} className="sm:col-span-2">
              <Select required value={form.feederId} onChange={set("feederId")} placeholder="Select feeder…" options={feeders} />
            </FormField>
            <FormField label="Type" error={err("type")} className="sm:col-span-2">
              <Select value={form.type} onChange={set("type")} options={toOptions(SCHEDULE_TYPES)} />
            </FormField>
          </>
        )}
        <FormField label="Start" error={err("startTime")}>
          <Input type="datetime-local" required value={form.startTime} onChange={set("startTime")} />
        </FormField>
        <FormField label="End" error={err("endTime")}>
          <Input type="datetime-local" required value={form.endTime} onChange={set("endTime")} />
        </FormField>
        <FormField label="Reason" error={err("reason")} className="sm:col-span-2">
          <Textarea value={form.reason} onChange={set("reason")} placeholder="e.g. Transformer maintenance" />
        </FormField>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="lg" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
