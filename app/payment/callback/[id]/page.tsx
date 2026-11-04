import { Suspense } from "react";
import { Loading } from "@/components/common/states";
import { PaymentCallback } from "./payment-callback";

// bKash redirects here: /payment/callback/:paymentId?paymentID=...&status=success|failure|cancel
export default function PaymentCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Suspense fallback={<Loading />}>
        <PaymentCallback />
      </Suspense>
    </main>
  );
}
