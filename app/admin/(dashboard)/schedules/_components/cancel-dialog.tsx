"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Textarea } from "@/components/ui/input";
import { api } from "@/lib/api";
import { fmtDateTime } from "@/lib/format";
import type { Schedule } from "@/lib/types";

export function CancelDialog({ row, onClose }: { row: Schedule; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const cancel = useMutation({
    mutationFn: () => api.post(`schedules/${row.id}/cancel`, { reason: reason.trim() }),
    onSuccess: onClose,
    meta: { success: "Schedule cancelled", invalidates: [["schedules"]] },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Cancel schedule" description={`${row.feeder?.name ?? "Feeder"} · ${fmtDateTime(row.startTime)}`}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          cancel.mutate();
        }}
      >
        <FormField label="Reason" error={cancel.error?.fieldError("reason")}>
          <Textarea required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Work postponed" />
        </FormField>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Back</Button>
          <Button type="submit" variant="destructive" size="lg" disabled={cancel.isPending}>
            {cancel.isPending ? "Cancelling…" : "Cancel schedule"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
