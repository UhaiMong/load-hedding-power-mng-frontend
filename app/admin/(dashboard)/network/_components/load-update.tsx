"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select } from "@/components/ui/input";
import { api } from "@/lib/api";
import { FEEDER_STATUSES, toOptions } from "@/lib/enums";
import type { Feeder } from "@/lib/types";

export function LoadUpdateButton({ feeder }: { feeder: Feeder }) {
  const [open, setOpen] = useState(false);
  const [loadMw, setLoadMw] = useState(String(feeder.loadMw));
  const [status, setStatus] = useState(feeder.status);

  const save = useMutation({
    mutationFn: () => api.patch(`feeders/${feeder.id}/load`, { loadMw: Number(loadMw), status }),
    onSuccess: () => setOpen(false),
    meta: { success: "Load reading updated", invalidates: [["feeders"]] },
  });

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Update load" title="Update load" onClick={() => setOpen(true)}>
        <Gauge />
      </Button>
      <Dialog open={open} onOpenChange={setOpen} title="Update live load" description={`${feeder.name} · capacity ${feeder.capacityMw} MW`}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <FormField label="Load (MW)" error={save.error?.fieldError("loadMw")}>
            <Input type="number" step="any" min={0} required value={loadMw} onChange={(e) => setLoadMw(e.target.value)} />
          </FormField>
          <FormField label="Status" error={save.error?.fieldError("status")}>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} options={toOptions(FEEDER_STATUSES)} />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Update"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
