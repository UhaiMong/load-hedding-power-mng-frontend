"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, RefreshCw } from "lucide-react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { customerOf, trxOf } from "@/lib/billing";
import { PAYMENT_STATUS_TONES, PAYMENT_STATUSES, toOptions } from "@/lib/enums";
import { fmtDateTime, fmtMoney, fmtMonth } from "@/lib/format";
import type { Payment } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export default function PaymentsPage() {
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState("desc");

  const list = useApi<Payment[]>("payments", { status, sortBy: "createdAt", order, page, limit: 10 });
  const rows = list.data?.data ?? [];
  const verify = useMutation({
    mutationFn: (id: string) => api.post(`payments/${id}/verify`),
    meta: { success: "Payment status refreshed from bKash", invalidates: [["payments"], ["bills"]] },
  });

  return (
    <>
      <PageHeader title={isCustomer ? "My payments" : "Payments"} description="bKash payment history" />
      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        <div className="flex flex-wrap gap-2 border-b p-3">
          <Select
            className="w-auto"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            placeholder="All statuses"
            options={toOptions(PAYMENT_STATUSES)}
          />
          <Select
            className="w-auto"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            options={[
              { value: "desc", label: "Newest first" },
              { value: "asc", label: "Oldest first" },
            ]}
          />
        </div>

        <QueryState query={list} empty={rows.length === 0} emptyMessage="No payments yet.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Bill</TableHead>
                {!isCustomer && <TableHead>Customer</TableHead>}
                <TableHead>Amount</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{fmtDateTime(p.createdAt)}</TableCell>
                  <TableCell>{fmtMonth(p.bill?.billingMonth)}</TableCell>
                  {!isCustomer && <TableCell>{customerOf(p)?.name ?? "—"}</TableCell>}
                  <TableCell>{fmtMoney(p.amount)}</TableCell>
                  <TableCell className="font-mono">{trxOf(p) ?? "—"}</TableCell>
                  <TableCell><EnumBadge value={p.status} tones={PAYMENT_STATUS_TONES} /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {p.status === "PENDING" && (
                        <Button variant="ghost" size="icon" aria-label="Verify with bKash" title="Verify with bKash" disabled={verify.isPending} onClick={() => verify.mutate(p.id)}>
                          <RefreshCw />
                        </Button>
                      )}
                      <Link href={`/admin/payments/${p.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })} aria-label="View">
                        <Eye />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </QueryState>
        <Pagination meta={list.data?.meta} onPage={setPage} />
      </div>
    </>
  );
}
