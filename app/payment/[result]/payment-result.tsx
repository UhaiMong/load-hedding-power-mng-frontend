"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PaymentResultCard, statusFromWord } from "@/components/common/payment-result-card";
import { Loading } from "@/components/common/states";
import { api } from "@/lib/api";
import { LAST_PAYMENT_KEY } from "@/lib/billing";
import type { Payment } from "@/lib/types";

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

  return (
    <PaymentResultCard
      payment={verify.data?.data}
      fallbackStatus={statusFromWord(result ?? "")}
      error={verify.error?.message}
      paymentId={paymentId}
    />
  );
}
