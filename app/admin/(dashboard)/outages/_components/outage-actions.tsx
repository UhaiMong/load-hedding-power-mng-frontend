"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Ban, CheckCircle2, ShieldCheck, Trash2, UserPlus, Wand2, Wrench } from "lucide-react";
import { ConfirmButton } from "@/components/common/confirm-button";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Role } from "@/lib/constants";
import { OUTAGE_SEVERITIES, toOptions } from "@/lib/enums";
import { toLocalInput } from "@/lib/format";
import { STAFF } from "@/lib/routes";
import type { Outage, User } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { ActionDialog } from "./action-dialog";

type Kind = "verify" | "reject" | "assign" | "start" | "restore";

export function OutageActions({ outage: o, role }: { outage: Outage; role: Role }) {
  const router = useRouter();
  const [open, setOpen] = useState<Kind | null>(null);
  const staff = STAFF.includes(role);
  const tech = role === "TECHNICIAN";
  const url = `outages/${o.id}`;

  const techs = useApi<User[]>(open === "assign" ? "users/technicians" : null, { available: true, limit: 50 });
  const techOptions = techs.data?.data.map((t) => ({
    value: t.id,
    label: `${t.name}${t.profile?.zone ? ` · ${t.profile.zone.name}` : ""}${t.profile?.isBusy ? " (busy)" : ""}`,
  }));

  const autoAssign = useMutation({
    mutationFn: () => api.post(`${url}/auto-assign`),
    meta: { success: "Technician auto-assigned", invalidates: [["outages"]] },
  });
  const remove = useMutation({
    mutationFn: () => api.delete(url),
    onSuccess: () => router.replace("/admin/outages"),
    meta: { success: "Outage deleted", invalidates: [["outages"]] },
  });

  const close = () => setOpen(null);
  const buttons = [
    staff && o.status === "REPORTED" && (
      <Button key="v" size="lg" onClick={() => setOpen("verify")}><ShieldCheck /> Verify</Button>
    ),
    staff && o.status === "REPORTED" && (
      <Button key="r" size="lg" variant="outline" onClick={() => setOpen("reject")}><Ban /> Reject</Button>
    ),
    staff && o.status === "VERIFIED" && (
      <Button key="a" size="lg" onClick={() => setOpen("assign")}><UserPlus /> Assign technician</Button>
    ),
    staff && o.status === "VERIFIED" && (
      <Button key="aa" size="lg" variant="outline" disabled={autoAssign.isPending} onClick={() => autoAssign.mutate()}>
        <Wand2 /> {autoAssign.isPending ? "Assigning…" : "Auto-assign"}
      </Button>
    ),
    tech && o.status === "ASSIGNED" && (
      <Button key="s" size="lg" onClick={() => setOpen("start")}><Wrench /> Start work</Button>
    ),
    tech && o.status === "IN_PROGRESS" && (
      <Button key="d" size="lg" onClick={() => setOpen("restore")}><CheckCircle2 /> Mark restored</Button>
    ),
    role === "ADMIN" && (
      <ConfirmButton
        key="del"
        size="lg"
        variant="destructive"
        title="Delete this outage?"
        confirmLabel="Delete"
        pending={remove.isPending}
        onConfirm={() => remove.mutateAsync()}
      >
        <Trash2 /> Delete
      </ConfirmButton>
    ),
  ].filter(Boolean);

  if (buttons.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {buttons}

      {open === "verify" && (
        <ActionDialog
          title="Verify outage"
          fields={[
            { name: "severity", label: "Severity", type: "select", options: toOptions(OUTAGE_SEVERITIES), required: true },
            { name: "cause", label: "Cause" },
            { name: "estimatedRestorationAt", label: "Estimated restoration", type: "datetime" },
          ]}
          initial={{ severity: o.severity ?? "MEDIUM", cause: o.cause ?? "", estimatedRestorationAt: toLocalInput(o.estimatedRestorationAt) }}
          submitLabel="Verify"
          success="Outage verified"
          send={(b) => api.patch(`${url}/verify`, b)}
          onClose={close}
        />
      )}
      {open === "reject" && (
        <ActionDialog
          title="Reject report"
          fields={[{ name: "reason", label: "Reason", type: "textarea", required: true }]}
          submitLabel="Reject"
          success="Report rejected"
          send={(b) => api.post(`${url}/reject`, b)}
          onClose={close}
        />
      )}
      {open === "assign" && (
        <ActionDialog
          title="Assign technician"
          description={techs.isPending ? "Loading available technicians…" : techOptions?.length ? undefined : "No technicians are available right now."}
          fields={[{ name: "technicianId", label: "Technician", type: "select", options: techOptions, required: true }]}
          submitLabel="Assign"
          success="Technician assigned"
          send={(b) => api.post(`${url}/assign`, b)}
          onClose={close}
        />
      )}
      {open === "start" && (
        <ActionDialog
          title="Start work"
          fields={[{ name: "notes", label: "Notes", type: "textarea" }]}
          initial={{ notes: "Reached the site" }}
          submitLabel="Start"
          success="Marked in progress"
          send={(b) => api.patch(`${url}/status`, { ...b, status: "IN_PROGRESS" })}
          onClose={close}
        />
      )}
      {open === "restore" && (
        <ActionDialog
          title="Mark power restored"
          fields={[
            { name: "notes", label: "Work notes", type: "textarea" },
            { name: "cause", label: "Root cause" },
          ]}
          initial={{ cause: o.cause ?? "" }}
          submitLabel="Restored"
          success="Outage restored"
          send={(b) => api.patch(`${url}/status`, { ...b, status: "RESTORED" })}
          onClose={close}
        />
      )}
    </div>
  );
}
