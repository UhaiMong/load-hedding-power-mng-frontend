import type { Tone } from "@/components/ui/badge";

// Keep in sync with the backend Prisma enums
export const FEEDER_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export const FEEDER_STATUSES = ["ENERGIZED", "SHED", "FAULT", "MAINTENANCE"];
export const AREA_TYPES = ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "CRITICAL"];

export const PRIORITY_TONES: Record<string, Tone> = { LOW: "gray", MEDIUM: "blue", HIGH: "yellow", CRITICAL: "red" };
export const FEEDER_STATUS_TONES: Record<string, Tone> = { ENERGIZED: "green", SHED: "yellow", FAULT: "red", MAINTENANCE: "purple" };

export const SCHEDULE_TYPES = ["LOAD_SHEDDING", "MAINTENANCE"];
export const SCHEDULE_STATUSES = ["SCHEDULED", "ACTIVE", "COMPLETED", "CANCELLED"];
export const SCHEDULE_STATUS_TONES: Record<string, Tone> = { SCHEDULED: "blue", ACTIVE: "yellow", COMPLETED: "green", CANCELLED: "gray" };
export const SCHEDULE_TYPE_TONES: Record<string, Tone> = { LOAD_SHEDDING: "red", MAINTENANCE: "purple" };

/** "IN_PROGRESS" → "In progress" */
export const humanize = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, " ");

export const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: humanize(v) }));
