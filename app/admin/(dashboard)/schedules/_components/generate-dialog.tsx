"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { fmtTime, todayISO } from "@/lib/format";
import { useOptions } from "@/lib/use-options";

type Row = Record<string, unknown> & { feeder?: { name?: string; code?: string } };

// Preview shape may be an array or an object holding one
function planRows(data: unknown): Row[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") for (const v of Object.values(data)) if (Array.isArray(v)) return v;
  return [];
}
const summary = (data: unknown) =>
  data && typeof data === "object" && !Array.isArray(data)
    ? Object.entries(data).filter(([, v]) => typeof v === "number" || typeof v === "string")
    : [];

const NUMBERS = [
  ["deficitMw", "Deficit (MW)"],
  ["startHour", "Start hour (0-23)"],
  ["endHour", "End hour (1-24)"],
  ["slotHours", "Slot length (h)"],
  ["maxShedHoursPerFeeder", "Max shed hours / feeder"],
] as const;

export function GenerateDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const zones = useOptions("zones");
  const [form, setForm] = useState({
    zoneId: user?.profile?.zone?.id ?? "",
    date: todayISO(),
    deficitMw: "20",
    startHour: "8",
    endHour: "22",
    slotHours: "2",
    maxShedHoursPerFeeder: "4",
    reason: "",
  });

  const body = (dryRun: boolean) => ({
    zoneId: form.zoneId,
    date: form.date,
    ...Object.fromEntries(NUMBERS.map(([k]) => [k, Number(form[k])])),
    utcOffsetMinutes: -new Date().getTimezoneOffset(),
    reason: form.reason.trim() || undefined,
    dryRun,
  });

  const preview = useMutation({ mutationFn: () => api.post<unknown>("schedules/generate", body(true)) });
  const save = useMutation({
    mutationFn: () => api.post("schedules/generate", body(false)),
    onSuccess: onClose,
    meta: { success: "Load-shedding schedule saved", invalidates: [["schedules"]] },
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    preview.reset(); // inputs changed: preview is stale
  };
  const err = (n: string) => (save.error ?? preview.error)?.fieldError(n);
  const result = preview.data?.data;
  const rows = planRows(result);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Generate load-shedding schedule" description="Preview the plan first, then save it." className="max-w-2xl">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          preview.mutate();
        }}
      >
        <FormField label="Zone" error={err("zoneId")}>
          <Select required value={form.zoneId} onChange={set("zoneId")} placeholder="Select zone…" options={zones} />
        </FormField>
        <FormField label="Date" error={err("date")}>
          <Input type="date" required value={form.date} onChange={set("date")} />
        </FormField>
        {NUMBERS.map(([k, label]) => (
          <FormField key={k} label={label} error={err(k)}>
            <Input type="number" min={0} step="any" required value={form[k]} onChange={set(k)} />
          </FormField>
        ))}
        <FormField label="Reason" error={err("reason")} className="sm:col-span-2">
          <Textarea value={form.reason} onChange={set("reason")} placeholder="e.g. Gas supply shortage" />
        </FormField>

        {result !== undefined && (
          <div className="space-y-2 sm:col-span-2">
            <p className="text-sm font-medium">Preview</p>
            {summary(result).length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {summary(result).map(([k, v]) => (
                  <span key={k} className="rounded bg-muted px-2 py-1">{k}: {String(v)}</span>
                ))}
              </div>
            )}
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No slots needed for these inputs.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feeder</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.feeder?.name ?? String(r.feederName ?? r.feederCode ?? r.feederId ?? "—")}</TableCell>
                        <TableCell>{fmtTime(r.startTime as string)}</TableCell>
                        <TableCell>{fmtTime(r.endTime as string)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Close</Button>
          <Button type="submit" variant="secondary" size="lg" disabled={preview.isPending}>
            {preview.isPending ? "Previewing…" : "Preview"}
          </Button>
          <Button type="button" size="lg" disabled={!preview.isSuccess || save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? "Saving…" : "Save schedule"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
