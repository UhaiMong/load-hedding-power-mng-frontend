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

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  [key: string]: unknown;
}
