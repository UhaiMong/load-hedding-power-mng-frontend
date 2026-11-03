"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, Plus, Trash2, Wallet } from "lucide-react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { ConfirmButton } from "@/components/common/confirm-button";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { billAmount, customerOf, startBkashPayment } from "@/lib/billing";
import { BILL_STATUS_TONES, BILL_STATUSES, toOptions } from "@/lib/enums";
import { fmtDate, fmtMoney, fmtMonth } from "@/lib/format";
import type { Bill } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { BillDialog } from "./_components/bill-dialog";
import { CreateBillDialog } from "./_components/create-bill-dialog";

export default function BillsPage() {
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";
  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [order, setOrder] = useState("desc");
  const [viewing, setViewing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useApi<Bill[]>("bills", { status, month, sortBy: "dueDate", order, page, limit: 10 });
  const rows = list.data?.data ?? [];

  const pay = useMutation({ mutationFn: startBkashPayment });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`bills/${id}`),
    meta: { success: "Bill deleted", invalidates: [["bills"]] },
  });

  return (
    <>
      <PageHeader
        title={isCustomer ? "My bills" : "Bills"}
        description={isCustomer ? "Pay your electricity bills securely with bKash." : "Monthly bills (tariff calculated by the server)."}
        actions={
          !isCustomer && (
            <Button size="lg" onClick={() => setCreating(true)}>
              <Plus /> Create bill
            </Button>
          )
        }
      />

      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <Select
            className="w-auto"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            placeholder="All statuses"
            options={toOptions(BILL_STATUSES)}
          />
          <Input
            type="month"
            className="w-auto"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setPage(1);
            }}
          />
          <Select
            className="w-auto"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            options={[
              { value: "desc", label: "Due date: latest" },
              { value: "asc", label: "Due date: earliest" },
            ]}
          />
        </div>

        <QueryState query={list} empty={rows.length === 0} emptyMessage="No bills found.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                {!isCustomer && <TableHead>Customer</TableHead>}
                <TableHead>Units</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b) => {
                const unpaid = b.status !== "PAID";
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{fmtMonth(b.billingMonth)}</TableCell>
                    {!isCustomer && (
                      <TableCell>
                        <p>{customerOf(b)?.name ?? "—"}</p>
                        <p className="text-muted-foreground">{customerOf(b)?.profile?.meterNumber ?? customerOf(b)?.email}</p>
                      </TableCell>
                    )}
                    <TableCell>{b.units} kWh</TableCell>
                    <TableCell>{fmtMoney(billAmount(b))}</TableCell>
                    <TableCell>{fmtDate(b.dueDate)}</TableCell>
                    <TableCell><EnumBadge value={b.status} tones={BILL_STATUS_TONES} /></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="View" onClick={() => setViewing(b.id)}>
                          <Eye />
                        </Button>
                        {isCustomer && unpaid && (
                          <Button size="sm" disabled={pay.isPending} onClick={() => pay.mutate(b.id)}>
                            <Wallet /> {pay.isPending && pay.variables === b.id ? "Redirecting…" : "Pay with bKash"}
                          </Button>
                        )}
                        {isAdmin && unpaid && (
                          <ConfirmButton
                            variant="ghost"
                            size="icon"
                            aria-label="Delete"
                            title="Delete this bill?"
                            description="Only unpaid bills can be deleted."
                            confirmLabel="Delete"
                            pending={remove.isPending}
                            onConfirm={() => remove.mutateAsync(b.id)}
                          >
                            <Trash2 className="text-destructive" />
                          </ConfirmButton>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </QueryState>
        <Pagination meta={list.data?.meta} onPage={setPage} />
      </div>

      {viewing && <BillDialog id={viewing} canPay={isCustomer} onClose={() => setViewing(null)} />}
      {creating && <CreateBillDialog onClose={() => setCreating(false)} />}
    </>
  );
}
