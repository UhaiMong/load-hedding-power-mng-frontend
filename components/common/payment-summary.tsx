import { EnumBadge } from "@/components/ui/badge";
import { customerOf, trxOf } from "@/lib/billing";
import { PAYMENT_STATUS_TONES } from "@/lib/enums";
import { fmtDateTime, fmtMoney, fmtMonth } from "@/lib/format";
import type { Payment } from "@/lib/types";

export function PaymentSummary({ payment: p }: { payment: Payment }) {
  const rows: [string, React.ReactNode][] = [
    ["Status", <EnumBadge key="s" value={p.status} tones={PAYMENT_STATUS_TONES} />],
    ["Amount", fmtMoney(p.amount)],
    ["Bill month", fmtMonth(p.bill?.billingMonth)],
    ["Customer", customerOf(p)?.name],
    ["Method", p.method ?? "bKash"],
    ["Transaction ID", trxOf(p)],
    ["bKash payment ID", p.bkashPaymentId],
    ["Started", fmtDateTime(p.createdAt)],
    ["Completed", (p.paidAt ?? p.completedAt) && fmtDateTime(p.paidAt ?? p.completedAt)],
  ];
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="break-all">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
