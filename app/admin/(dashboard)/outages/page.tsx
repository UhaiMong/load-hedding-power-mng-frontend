"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Megaphone } from "lucide-react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OUTAGE_SEVERITIES, OUTAGE_STATUS_TONES, OUTAGE_STATUSES, SEVERITY_TONES, toOptions } from "@/lib/enums";
import { fmtDateTime } from "@/lib/format";
import type { Outage } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { startedOf, technicianOf } from "./_components/helpers";
import { ReportDialog } from "./_components/report-dialog";

export default function OutagesPage() {
  const { user } = useAuth();
  const role = user?.role;
  const isCustomer = role === "CUSTOMER";
  const isTech = role === "TECHNICIAN";

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [order, setOrder] = useState("desc");
  const [reporting, setReporting] = useState(false);

  // each role reads its own list endpoint
  const path = isCustomer ? "outages/my-reports" : isTech ? "outages/my-assigned" : "outages";
  const query = isCustomer
    ? { page, limit: 10 }
    : isTech
      ? { status, page, limit: 10 }
      : { status, severity, sortBy: "startedAt", order, page, limit: 10 };
  const list = useApi<Outage[]>(path, query);
  const rows = list.data?.data ?? [];

  const pick = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    set(e.target.value);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title={isCustomer ? "My outage reports" : isTech ? "My assigned jobs" : "Outages"}
        description={isCustomer ? "Report a power cut in your area and track it." : "Track outages from report to restoration."}
        actions={
          isCustomer && (
            <Button size="lg" onClick={() => setReporting(true)}>
              <Megaphone /> Report outage
            </Button>
          )
        }
      />

      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        {!isCustomer && (
          <div className="flex flex-wrap gap-2 border-b p-3">
            <Select className="w-auto" value={status} onChange={pick(setStatus)} placeholder="All statuses" options={toOptions(OUTAGE_STATUSES)} />
            {!isTech && (
              <>
                <Select className="w-auto" value={severity} onChange={pick(setSeverity)} placeholder="All severities" options={toOptions(OUTAGE_SEVERITIES)} />
                <Select
                  className="w-auto"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  options={[
                    { value: "desc", label: "Newest first" },
                    { value: "asc", label: "Oldest first" },
                  ]}
                />
              </>
            )}
          </div>
        )}

        <QueryState query={list} empty={rows.length === 0} emptyMessage="No outages found.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <p className="font-medium">{o.area?.name ?? "—"}</p>
                    <p className="text-muted-foreground">{o.area?.feeder?.name ?? o.feeder?.name}</p>
                  </TableCell>
                  <TableCell className="max-w-56 truncate">{o.description || "—"}</TableCell>
                  <TableCell>{o.severity ? <EnumBadge value={o.severity} tones={SEVERITY_TONES} /> : "—"}</TableCell>
                  <TableCell><EnumBadge value={o.status} tones={OUTAGE_STATUS_TONES} /></TableCell>
                  <TableCell>{fmtDateTime(startedOf(o))}</TableCell>
                  <TableCell>{technicianOf(o)?.name ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/outages/${o.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="View">
                      <Eye />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </QueryState>
        <Pagination meta={list.data?.meta} onPage={setPage} />
      </div>

      {reporting && <ReportDialog onClose={() => setReporting(false)} />}
    </>
  );
}
