"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { PaymentSummary } from "@/components/common/payment-summary";
import { QueryState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Payment } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const q = useApi<Payment>(`payments/${id}`);
  const p = q.data?.data;
  const verify = useMutation({
    mutationFn: () => api.post(`payments/${id}/verify`),
    meta: { success: "Payment status refreshed from bKash", invalidates: [["payments"], ["bills"]] },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/admin/payments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to payments
      </Link>
      <section className="rounded-lg bg-background p-5 ring-1 ring-foreground/10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Payment</h1>
          {p?.status === "PENDING" && (
            <Button size="lg" variant="outline" disabled={verify.isPending} onClick={() => verify.mutate()}>
              <RefreshCw /> {verify.isPending ? "Checking…" : "Verify with bKash"}
            </Button>
          )}
        </div>
        <QueryState query={q}>{p && <PaymentSummary payment={p} />}</QueryState>
      </section>
    </div>
  );
}
