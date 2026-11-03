"use client";

import { useMutation } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { billAmount, customerOf, startBkashPayment } from "@/lib/billing";
import { BILL_STATUS_TONES } from "@/lib/enums";
import { fmtDate, fmtDateTime, fmtMoney, fmtMonth } from "@/lib/format";
import type { Bill } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type Slab = { units?: number; rate?: number; amount?: number; from?: number; to?: number | null; label?: string };

export function BillDialog({ id, canPay, onClose }: { id: string; canPay: boolean; onClose: () => void }) {
  const q = useApi<Bill>(`bills/${id}`);
  const b = q.data?.data;
  const pay = useMutation({ mutationFn: startBkashPayment });
  const slabs = Array.isArray(b?.breakdown) ? (b.breakdown as Slab[]) : [];

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Bill details">
      <QueryState query={q}>
        {b && (
          <div className="space-y-4 text-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <Item label="Billing month" value={fmtMonth(b.billingMonth)} />
              <Item label="Status" value={<EnumBadge value={b.status} tones={BILL_STATUS_TONES} />} />
              <Item label="Customer" value={customerOf(b)?.name} />
              <Item label="Meter no." value={customerOf(b)?.profile?.meterNumber} />
              <Item label="Units used" value={`${b.units} kWh`} />
              <Item label="Due date" value={fmtDate(b.dueDate)} />
              {b.paidAt && <Item label="Paid at" value={fmtDateTime(b.paidAt)} />}
            </dl>

            {slabs.length > 0 && (
              <div className="rounded-md border">
                {slabs.map((s, i) => (
                  <div key={i} className="flex justify-between border-b px-3 py-2 last:border-0">
                    <span>{s.label ?? `${s.units ?? "?"} units × ${fmtMoney(s.rate)}`}</span>
                    <span>{fmtMoney(s.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <span className="font-medium">Total</span>
              <span className="text-lg font-semibold">{fmtMoney(billAmount(b))}</span>
            </div>

            {canPay && b.status !== "PAID" && (
              <Button size="lg" className="w-full" disabled={pay.isPending} onClick={() => pay.mutate(b.id)}>
                <Wallet /> {pay.isPending ? "Redirecting to bKash…" : "Pay with bKash"}
              </Button>
            )}
          </div>
        )}
      </QueryState>
    </Dialog>
  );
}

function Item({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}
