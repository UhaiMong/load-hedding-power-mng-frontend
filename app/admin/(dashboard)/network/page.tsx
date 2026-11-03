"use client";

import { useState } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { CrudTable } from "@/components/common/crud-table";
import { PageHeader } from "@/components/common/page-header";
import { cn } from "@/lib/utils";
import { networkConfigs } from "./_components/configs";

const TABS = [
  { key: "zones", label: "Zones" },
  { key: "substations", label: "Substations" },
  { key: "feeders", label: "Feeders" },
  { key: "areas", label: "Areas" },
] as const;

export default function NetworkPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("zones");
  if (!user) return null;
  const configs = networkConfigs(user);

  return (
    <>
      <PageHeader title="Network" description="Zones → substations → feeders → areas" />
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-background p-1 ring-1 ring-foreground/10 sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium whitespace-nowrap",
              tab === t.key ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* key remounts the table so filters reset per tab */}
      {tab === "zones" && <CrudTable key="zones" config={configs.zones} />}
      {tab === "substations" && <CrudTable key="substations" config={configs.substations} />}
      {tab === "feeders" && <CrudTable key="feeders" config={configs.feeders} />}
      {tab === "areas" && <CrudTable key="areas" config={configs.areas} />}
    </>
  );
}
