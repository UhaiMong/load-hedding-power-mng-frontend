import type { CrudConfig } from "@/components/common/crud-table";
import { EnumBadge } from "@/components/ui/badge";
import {
  AREA_TYPES,
  FEEDER_PRIORITIES,
  FEEDER_STATUS_TONES,
  FEEDER_STATUSES,
  PRIORITY_TONES,
  toOptions,
} from "@/lib/enums";
import type { Area, Feeder, Substation, User, Zone } from "@/lib/types";
import { LoadUpdateButton } from "./load-update";

const nameCode = (r: { name: string; code: string }) => (
  <div>
    <p className="font-medium">{r.name}</p>
    <p className="text-muted-foreground">{r.code}</p>
  </div>
);
const byName = { value: "name", label: "Name" };

export function networkConfigs(user: User) {
  const admin = user.role === "ADMIN";
  const manager = admin || user.role === "ZONE_MANAGER";
  const ownZone = user.profile?.zone?.id;

  const zones: CrudConfig<Zone> = {
    path: "zones",
    singular: "Zone",
    searchable: true,
    sorts: [byName],
    columns: [
      { label: "Zone", cell: nameCode },
      { label: "Description", cell: (z) => z.description || "—" },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "code", label: "Code", required: true },
      { name: "description", label: "Description", type: "textarea", full: true },
    ],
    canCreate: admin,
    canEdit: (z) => admin || (user.role === "ZONE_MANAGER" && z.id === ownZone),
    canDelete: admin ? () => true : undefined,
  };

  const substations: CrudConfig<Substation> = {
    path: "substations",
    singular: "Substation",
    searchable: true,
    filters: [{ name: "zoneId", label: "Zones", optionsFrom: "zones" }],
    sorts: [byName, { value: "capacityMw", label: "Capacity" }],
    columns: [
      { label: "Substation", cell: nameCode },
      { label: "Zone", cell: (s) => s.zone?.name ?? "—" },
      { label: "Capacity", cell: (s) => `${s.capacityMw} MW` },
    ],
    fields: [
      { name: "zoneId", label: "Zone", type: "select", optionsFrom: "zones", required: true, full: true, only: "create" },
      { name: "name", label: "Name", required: true },
      { name: "code", label: "Code", required: true },
      { name: "capacityMw", label: "Capacity (MW)", type: "number", required: true },
    ],
    defaults: { zoneId: ownZone ?? "" },
    canCreate: manager,
    canEdit: manager ? () => true : undefined,
    canDelete: manager ? () => true : undefined,
  };

  const feeders: CrudConfig<Feeder> = {
    path: "feeders",
    singular: "Feeder",
    filters: [
      { name: "priority", label: "Priorities", options: toOptions(FEEDER_PRIORITIES) },
      { name: "status", label: "Statuses", options: toOptions(FEEDER_STATUSES) },
    ],
    sorts: [{ value: "loadMw", label: "Load" }, byName],
    columns: [
      { label: "Feeder", cell: nameCode },
      { label: "Substation", cell: (f) => f.substation?.name ?? "—" },
      {
        label: "Load / Capacity",
        cell: (f) => `${f.loadMw} / ${f.capacityMw} MW (${f.capacityMw ? Math.round((f.loadMw / f.capacityMw) * 100) : 0}%)`,
      },
      { label: "Priority", cell: (f) => <EnumBadge value={f.priority} tones={PRIORITY_TONES} /> },
      { label: "Status", cell: (f) => <EnumBadge value={f.status} tones={FEEDER_STATUS_TONES} /> },
    ],
    fields: [
      { name: "substationId", label: "Substation", type: "select", optionsFrom: "substations", required: true, full: true, only: "create" },
      { name: "name", label: "Name", required: true },
      { name: "code", label: "Code", required: true },
      { name: "capacityMw", label: "Capacity (MW)", type: "number", required: true },
      { name: "loadMw", label: "Current load (MW)", type: "number" },
      { name: "priority", label: "Priority", type: "select", options: toOptions(FEEDER_PRIORITIES), required: true },
      { name: "status", label: "Status", type: "select", options: toOptions(FEEDER_STATUSES), only: "edit" },
    ],
    defaults: { priority: "MEDIUM" },
    canCreate: manager,
    canEdit: manager ? () => true : undefined,
    canDelete: manager ? () => true : undefined,
    // operators can update live load too
    rowActions: (f) => <LoadUpdateButton feeder={f} />,
  };

  const areas: CrudConfig<Area> = {
    path: "areas",
    singular: "Area",
    searchable: true,
    filters: [{ name: "type", label: "Types", options: toOptions(AREA_TYPES) }],
    sorts: [byName],
    columns: [
      { label: "Area", cell: nameCode },
      { label: "Type", cell: (a) => (a.type ? <EnumBadge value={a.type} /> : "—") },
      { label: "Feeder", cell: (a) => a.feeder?.name ?? "—" },
      { label: "Customers", cell: (a) => a.customerCount ?? 0 },
      { label: "Address", cell: (a) => a.address || "—" },
    ],
    fields: [
      { name: "feederId", label: "Feeder", type: "select", optionsFrom: "feeders", required: true, full: true, only: "create" },
      { name: "name", label: "Name", required: true },
      { name: "code", label: "Code", required: true },
      { name: "type", label: "Type", type: "select", options: toOptions(AREA_TYPES), required: true },
      { name: "customerCount", label: "Customers", type: "number" },
      { name: "address", label: "Address", full: true },
    ],
    defaults: { type: "RESIDENTIAL" },
    canCreate: manager,
    canEdit: manager ? () => true : undefined,
    canDelete: manager ? () => true : undefined,
  };

  return { zones, substations, feeders, areas };
}
