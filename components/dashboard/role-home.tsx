"use client";

import Link from "next/link";
import { useAuth } from "@/app/Providers/AuthProvider";
import { PageHeader } from "@/components/common/page-header";
import { ROLE_LABEL } from "@/lib/constants";
import { navFor } from "./nav-items";
import { AdminWidgets, CustomerWidgets, StaffWidgets, TechnicianWidgets } from "./role-widgets";

/** Landing page for each role: role widgets + quick links. */
export function RoleHome() {
  const { user } = useAuth();
  if (!user) return null;
  const links = navFor(user.role).slice(1);
  const widgets = {
    ADMIN: <AdminWidgets />,
    ZONE_MANAGER: <StaffWidgets />,
    OPERATOR: <StaffWidgets />,
    TECHNICIAN: <TechnicianWidgets />,
    CUSTOMER: <CustomerWidgets />,
  }[user.role];

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome, ${user.name}`} description={`${ROLE_LABEL[user.role]} dashboard`} />
      {widgets}
      <div>
        <h2 className="mb-3 font-semibold">Quick links</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg bg-background p-4 text-sm font-medium ring-1 ring-foreground/10 hover:bg-muted"
            >
              <Icon className="size-5 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
