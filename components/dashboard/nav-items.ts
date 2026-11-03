import {
  Bell,
  CalendarClock,
  ChartColumn,
  CreditCard,
  LayoutDashboard,
  Network,
  Receipt,
  ScrollText,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { homeFor, type Role } from "@/lib/constants";
import { canAccess } from "@/lib/routes";

const ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin/outages", label: "Outages", icon: Zap },
  { href: "/admin/schedules", label: "Schedules", icon: CalendarClock },
  { href: "/admin/network", label: "Network", icon: Network },
  { href: "/admin/bills", label: "Bills", icon: Receipt },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: ChartColumn },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/audit-logs", label: "Audit logs", icon: ScrollText },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/profile", label: "Profile", icon: User },
];

/** Sidebar links this role may open (same rules as the proxy). */
export function navFor(role: Role) {
  return [
    { href: homeFor(role), label: "Dashboard", icon: LayoutDashboard },
    ...ITEMS.filter((i) => canAccess(i.href, role)),
  ];
}
