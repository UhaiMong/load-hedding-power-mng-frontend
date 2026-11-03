import type { Outage } from "@/lib/types";

// Backend relation names may vary; read whichever is present
export const reporterOf = (o: Outage) => o.reportedBy ?? o.reporter ?? null;
export const technicianOf = (o: Outage) => o.technician ?? o.assignedTo ?? null;
export const imageOf = (o: Outage) => o.imageUrl ?? o.image ?? null;
export const startedOf = (o: Outage) => o.startedAt ?? o.createdAt;
