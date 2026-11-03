import { Suspense } from "react";
import { Loading } from "@/components/common/states";
import { PaymentResult } from "./payment-result";

// bKash return page: /payment/success | /payment/failed | /payment/cancelled ?paymentId=...
export default function PaymentResultPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Suspense fallback={<Loading />}>
        <PaymentResult />
      </Suspense>
    </main>
  );
}
