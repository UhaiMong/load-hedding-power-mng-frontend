"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fmtDateTime } from "@/lib/format";
import type { AuditLog } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { useDebounce } from "@/lib/use-debounce";

const ENTITIES = ["User", "Zone", "Substation", "Feeder", "Area", "Schedule", "Outage", "Bill", "Payment"];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const actionQ = useDebounce(action.trim().toUpperCase());

  const list = useApi<AuditLog[]>("admin/audit-logs", { entity, action: actionQ, page, limit: 20 });
  const rows = list.data?.data ?? [];

  return (
    <>
      <PageHeader title="Audit logs" description="Who did what, and when." />
      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        <div className="flex flex-wrap gap-2 border-b p-3">
          <Select
            className="w-auto"
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              setPage(1);
            }}
            placeholder="All entities"
            options={ENTITIES.map((e) => ({ value: e, label: e }))}
          />
          <Input
            className="w-full sm:w-56"
            placeholder="Action, e.g. OUTAGE_VERIFIED"
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <QueryState query={list} empty={rows.length === 0} emptyMessage="No log entries.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((log) => {
                const actor = log.user ?? log.actor;
                const details = log.metadata ?? log.details ?? log.changes;
                const open = expanded === log.id;
                return (
                  <Fragment key={log.id}>
                    <TableRow>
                      <TableCell>
                        {details != null && (
                          <Button variant="ghost" size="icon-sm" aria-label="Toggle details" onClick={() => setExpanded(open ? null : log.id)}>
                            {open ? <ChevronDown /> : <ChevronRight />}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{fmtDateTime(log.createdAt)}</TableCell>
                      <TableCell>
                        <p>{actor?.name ?? "System"}</p>
                        {actor?.email && <p className="text-muted-foreground">{actor.email}</p>}
                      </TableCell>
                      <TableCell><EnumBadge value={log.action} /></TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell className="max-w-40 truncate font-mono">{log.entityId ?? "—"}</TableCell>
                    </TableRow>
                    {open && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <pre className="max-h-64 overflow-auto rounded bg-muted p-3 text-xs whitespace-pre-wrap">
                            {JSON.stringify(details, null, 2)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </QueryState>
        <Pagination meta={list.data?.meta} onPage={setPage} />
      </div>
    </>
  );
}
