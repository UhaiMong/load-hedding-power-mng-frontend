"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { PaymentResultCard, statusFromWord } from "@/components/common/payment-result-card";
import { Loading } from "@/components/common/states";
import { api } from "@/lib/api";
import type { Payment } from "@/lib/types";

export function PaymentCallback() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();

  // forward bKash's query to the backend callback once (it executes the payment)
  const callback = useMutation({
    mutationFn: () => api.get<Payment>(`payments/callback/${id}`, Object.fromEntries(params)),
    meta: { silent: true, invalidates: [["payments"], ["bills"]] },
  });
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    callback.mutate();
  }, [callback]);

  if (callback.isPending || callback.isIdle) return <Loading label="Confirming your payment with bKash…" />;

  return (
    <PaymentResultCard
      payment={callback.data?.data}
      fallbackStatus={statusFromWord(params.get("status") ?? "")}
      error={callback.error?.message}
      paymentId={id}
    />
  );
}
