import type { Role } from "./constants";

export interface Profile {
  phone: string | null;
  address: string | null;
  meterNumber: string | null;
  isAvailable: boolean;
  isBusy: boolean;
  area: {
    id: string;
    name: string;
    code: string;
    feeder: { id: string; name: string; code: string };
  } | null;
  zone: { id: string; name: string; code: string } | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt: string;
  profile?: Profile | null;
}

export interface Ref {
  id: string;
  name: string;
  code: string;
}

export interface Zone extends Ref {
  description?: string | null;
}

export interface Substation extends Ref {
  zoneId: string;
  capacityMw: number;
  zone?: Ref;
}

export interface Feeder extends Ref {
  substationId: string;
  capacityMw: number;
  loadMw: number;
  priority: string;
  status: string;
  substation?: Ref & { zone?: Ref };
}

export interface Area extends Ref {
  type?: string;
  customerCount?: number;
  address?: string | null;
  feederId?: string;
  feeder?: Ref;
}

export interface Schedule {
  id: string;
  feederId: string;
  type: string;
  status: string;
  startTime: string;
  endTime: string;
  reason?: string | null;
  cancelReason?: string | null;
  createdAt?: string;
  feeder?: Ref & { substation?: Ref & { zone?: Ref } };
  createdBy?: { id: string; name: string } | null;
}

type Person = { id: string; name: string; email?: string; phone?: string | null } | null;

export interface Outage {
  id: string;
  description?: string | null;
  status: string;
  severity?: string | null;
  cause?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  startedAt?: string;
  createdAt?: string;
  estimatedRestorationAt?: string | null;
  restoredAt?: string | null;
  rejectReason?: string | null;
  area?: (Ref & { feeder?: Ref }) | null;
  feeder?: Ref | null;
  reportedBy?: Person;
  reporter?: Person;
  technician?: Person;
  assignedTo?: Person;
}

export interface TimelineEvent {
  id: string;
  status?: string;
  action?: string;
  notes?: string | null;
  note?: string | null;
  message?: string | null;
  createdAt: string;
  actor?: Person;
  user?: Person;
  changedBy?: Person;
}

export interface Notification {
  id: string;
  title?: string | null;
  message?: string | null;
  body?: string | null;
  type?: string | null;
  isRead?: boolean;
  readAt?: string | null;
  link?: string | null;
  data?: Record<string, unknown> | null;
  createdAt: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  [key: string]: unknown;
}
