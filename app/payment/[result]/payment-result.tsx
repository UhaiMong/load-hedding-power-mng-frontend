"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import { PaymentSummary } from "@/components/common/payment-summary";
import { Loading } from "@/components/common/states";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/lib/api";
import { LAST_PAYMENT_KEY } from "@/lib/billing";
import type { Payment } from "@/lib/types";

const VIEW = {
  COMPLETED: { icon: CircleCheck, color: "text-green-600", title: "Payment successful", text: "Thank you! Your bill has been paid." },
  PENDING: { icon: Clock, color: "text-yellow-600", title: "Payment pending", text: "bKash hasn't confirmed yet. Check again in a moment." },
  FAILED: { icon: CircleX, color: "text-destructive", title: "Payment failed", text: "No money was taken. You can try again from your bills." },
  CANCELLED: { icon: CircleX, color: "text-muted-foreground", title: "Payment cancelled", text: "You cancelled the payment. Your bill is still unpaid." },
};

const fromUrl = (r: string) =>
  r.startsWith("success") ? "COMPLETED" : r.startsWith("cancel") ? "CANCELLED" : r.startsWith("fail") ? "FAILED" : "PENDING";

export function PaymentResult() {
  const { result } = useParams<{ result: string }>();
  const params = useSearchParams();
  const queryId = params.get("paymentId") ?? params.get("id");
  const [storedId, setStoredId] = useState<string | null>(null);
  useEffect(() => {
    if (queryId) return;
    try {
      setStoredId(sessionStorage.getItem(LAST_PAYMENT_KEY)); // saved when checkout started
    } catch {}
  }, [queryId]);
  const paymentId = queryId ?? storedId;

  // re-check with bKash once; the backend's status is the source of truth
  const verify = useMutation({
    mutationFn: () => api.post<Payment>(`payments/${paymentId}/verify`),
    meta: { silent: true, invalidates: [["payments"], ["bills"]] },
  });
  const started = useRef(false);
  useEffect(() => {
    if (!paymentId || started.current) return;
    started.current = true;
    verify.mutate();
  }, [paymentId, verify]);

  if (verify.isPending || (paymentId && verify.isIdle)) return <Loading label="Confirming your payment with bKash…" />;

  const payment = verify.data?.data;
  const status = (payment?.status ?? fromUrl(result ?? "")) as keyof typeof VIEW;
  const view = VIEW[status] ?? VIEW.PENDING;
  const Icon = view.icon;

  return (
    <div className="w-full max-w-md space-y-5 rounded-lg bg-background p-6 text-center ring-1 ring-foreground/10">
      <Icon className={`mx-auto size-14 ${view.color}`} />
      <div>
        <h1 className="text-xl font-semibold">{view.title}</h1>
        <p className="text-sm text-muted-foreground">{view.text}</p>
      </div>
      {payment && (
        <div className="text-left">
          <PaymentSummary payment={payment} />
        </div>
      )}
      {verify.isError && <p className="text-sm text-destructive">{verify.error.message}</p>}
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/admin/bills" className={buttonVariants({ size: "lg" })}>Go to my bills</Link>
        {paymentId && (
          <Link href={`/admin/payments/${paymentId}`} className={buttonVariants({ size: "lg", variant: "outline" })}>
            Payment details
          </Link>
        )}
      </div>
    </div>
  );
}
