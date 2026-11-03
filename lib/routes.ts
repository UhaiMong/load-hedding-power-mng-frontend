import type { Role } from "./constants";

export const STAFF: Role[] = ["OPERATOR", "ZONE_MANAGER", "ADMIN"];

/** Dashboard path prefixes and who may open them. Paths not listed are open to any logged-in user. */
export const ROUTE_ACCESS: [prefix: string, roles: Role[]][] = [
  ["/admin/superadmin", ["ADMIN"]],
  ["/admin/users", ["ADMIN"]],
  ["/admin/audit-logs", ["ADMIN"]],
  ["/admin/manager", ["ZONE_MANAGER"]],
  ["/admin/operator", ["OPERATOR"]],
  ["/admin/technician", ["TECHNICIAN"]],
  ["/admin/customer", ["CUSTOMER"]],
  ["/admin/network", STAFF],
  ["/admin/analytics", STAFF],
  ["/admin/bills", ["CUSTOMER", "OPERATOR", "ADMIN"]],
  ["/admin/payments", ["CUSTOMER", "OPERATOR", "ADMIN"]],
];

export function canAccess(path: string, role: Role) {
  const rule = ROUTE_ACCESS.find(([p]) => path === p || path.startsWith(`${p}/`));
  return !rule || rule[1].includes(role);
}
