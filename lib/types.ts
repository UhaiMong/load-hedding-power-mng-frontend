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

type Customer = (NonNullable<Person> & { profile?: { meterNumber?: string | null } | null }) | null;

export interface Bill {
  id: string;
  billingMonth: string;
  units: number;
  amount?: number | string;
  totalAmount?: number | string;
  status: string;
  dueDate: string;
  paidAt?: string | null;
  createdAt?: string;
  customerId?: string;
  customer?: Customer;
  user?: Customer;
  breakdown?: unknown;
}

export interface Payment {
  id: string;
  billId?: string;
  amount?: number | string;
  status: string;
  method?: string | null;
  bkashPaymentId?: string | null;
  trxId?: string | null;
  transactionId?: string | null;
  createdAt: string;
  paidAt?: string | null;
  completedAt?: string | null;
  bill?: Pick<Bill, "id" | "billingMonth"> | null;
  customer?: Customer;
  user?: Customer;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  ip?: string | null;
  createdAt: string;
  user?: Person;
  actor?: Person;
  metadata?: unknown;
  details?: unknown;
  changes?: unknown;
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
