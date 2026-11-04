import Link from "next/link";
import { CircleCheck, CircleX, Clock } from "lucide-react";
import { PaymentSummary } from "@/components/common/payment-summary";
import { buttonVariants } from "@/components/ui/button";
import type { Payment } from "@/lib/types";

const VIEW = {
  COMPLETED: { icon: CircleCheck, color: "text-green-600", title: "Payment successful", text: "Thank you! Your bill has been paid." },
  PENDING: { icon: Clock, color: "text-yellow-600", title: "Payment pending", text: "bKash hasn't confirmed yet. Check again in a moment." },
  FAILED: { icon: CircleX, color: "text-destructive", title: "Payment failed", text: "No money was taken. You can try again from your bills." },
  CANCELLED: { icon: CircleX, color: "text-muted-foreground", title: "Payment cancelled", text: "You cancelled the payment. Your bill is still unpaid." },
};

/** bKash/URL status word → payment status */
export const statusFromWord = (r: string) =>
  r.startsWith("success") ? "COMPLETED" : r.startsWith("cancel") ? "CANCELLED" : r.startsWith("fail") ? "FAILED" : "PENDING";

export function PaymentResultCard({
  payment,
  fallbackStatus,
  error,
  paymentId,
}: {
  payment?: Payment;
  fallbackStatus: string;
  error?: string;
  paymentId?: string | null;
}) {
  const view = VIEW[(payment?.status ?? fallbackStatus) as keyof typeof VIEW] ?? VIEW.PENDING;
  const Icon = view.icon;

  return (
    <div className="w-full max-w-md space-y-5 rounded-lg bg-background p-6 text-center ring-1 ring-foreground/10">
      <Icon className={`mx-auto size-14 ${view.color}`} />
      <div>
        <h1 className="text-xl font-semibold">{view.title}</h1>
        <p className="text-sm text-muted-foreground">{payment?.failureReason ?? view.text}</p>
      </div>
      {payment && (
        <div className="text-left">
          <PaymentSummary payment={payment} />
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
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
