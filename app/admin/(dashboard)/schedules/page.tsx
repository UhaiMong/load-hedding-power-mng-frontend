"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Ban, CalendarPlus, Eye, Pencil, Sparkles, Trash2 } from "lucide-react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { ConfirmButton } from "@/components/common/confirm-button";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { SCHEDULE_STATUS_TONES, SCHEDULE_STATUSES, SCHEDULE_TYPE_TONES, SCHEDULE_TYPES, toOptions } from "@/lib/enums";
import { fmtDate, fmtTime, todayISO } from "@/lib/format";
import { STAFF } from "@/lib/routes";
import type { Schedule } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { CancelDialog } from "./_components/cancel-dialog";
import { GenerateDialog } from "./_components/generate-dialog";
import { ScheduleForm } from "./_components/schedule-form";
import { ViewDialog } from "./_components/view-dialog";

type DialogState = { kind: "create" | "generate" } | { kind: "edit" | "cancel" | "view"; row: Schedule } | null;

export default function SchedulesPage() {
  const { user } = useAuth();
  const staff = !!user && STAFF.includes(user.role);
  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("asc");
  // customers start with upcoming schedules only
  const [filters, setFilters] = useState({ status: "", type: "", from: staff ? "" : todayISO(), to: "" });
  const [dialog, setDialog] = useState<DialogState>(null);

  const list = useApi<Schedule[]>("schedules", { ...filters, sortBy: "startTime", order, page, limit: 10 });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`schedules/${id}`),
    meta: { success: "Schedule deleted", invalidates: [["schedules"]] },
  });

  const setFilter = (k: keyof typeof filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((f) => ({ ...f, [k]: e.target.value }));
    setPage(1);
  };
  const rows = list.data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Schedules"
        description="Planned outages and load-shedding slots"
        actions={
          staff && (
            <>
              <Button size="lg" variant="outline" onClick={() => setDialog({ kind: "generate" })}>
                <Sparkles /> Generate load shedding
              </Button>
              <Button size="lg" onClick={() => setDialog({ kind: "create" })}>
                <CalendarPlus /> Planned outage
              </Button>
            </>
          )
        }
      />

      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <Select className="w-auto" value={filters.status} onChange={setFilter("status")} placeholder="All statuses" options={toOptions(SCHEDULE_STATUSES)} />
          <Select className="w-auto" value={filters.type} onChange={setFilter("type")} placeholder="All types" options={toOptions(SCHEDULE_TYPES)} />
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            From <Input type="date" className="w-auto" value={filters.from} onChange={setFilter("from")} />
          </label>
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            To <Input type="date" className="w-auto" value={filters.to} onChange={setFilter("to")} />
          </label>
          <Select
            className="w-auto"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            options={[
              { value: "asc", label: "Earliest first" },
              { value: "desc", label: "Latest first" },
            ]}
          />
        </div>

        <QueryState query={list} empty={rows.length === 0} emptyMessage="No schedules found.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feeder</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const editable = staff && s.status === "SCHEDULED";
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <p className="font-medium">{s.feeder?.name ?? "—"}</p>
                      <p className="text-muted-foreground">{s.feeder?.substation?.zone?.name ?? s.feeder?.code}</p>
                    </TableCell>
                    <TableCell><EnumBadge value={s.type} tones={SCHEDULE_TYPE_TONES} /></TableCell>
                    <TableCell>{fmtDate(s.startTime)}</TableCell>
                    <TableCell>{fmtTime(s.startTime)} – {fmtTime(s.endTime)}</TableCell>
                    <TableCell><EnumBadge value={s.status} tones={SCHEDULE_STATUS_TONES} /></TableCell>
                    <TableCell className="max-w-48 truncate">{s.reason || "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="View" onClick={() => setDialog({ kind: "view", row: s })}>
                          <Eye />
                        </Button>
                        {editable && (
                          <>
                            <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setDialog({ kind: "edit", row: s })}>
                              <Pencil />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Cancel schedule" onClick={() => setDialog({ kind: "cancel", row: s })}>
                              <Ban className="text-yellow-600" />
                            </Button>
                          </>
                        )}
                        {isAdmin && (
                          <ConfirmButton
                            variant="ghost"
                            size="icon"
                            aria-label="Delete"
                            title="Delete this schedule?"
                            confirmLabel="Delete"
                            pending={remove.isPending}
                            onConfirm={() => remove.mutateAsync(s.id)}
                          >
                            <Trash2 className="text-destructive" />
                          </ConfirmButton>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </QueryState>
        <Pagination meta={list.data?.meta} onPage={setPage} />
      </div>

      {dialog?.kind === "create" && <ScheduleForm onClose={() => setDialog(null)} />}
      {dialog?.kind === "edit" && <ScheduleForm row={dialog.row} onClose={() => setDialog(null)} />}
      {dialog?.kind === "cancel" && <CancelDialog row={dialog.row} onClose={() => setDialog(null)} />}
      {dialog?.kind === "view" && <ViewDialog id={dialog.row.id} onClose={() => setDialog(null)} />}
      {dialog?.kind === "generate" && <GenerateDialog onClose={() => setDialog(null)} />}
    </>
  );
}
