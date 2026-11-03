import { api } from "./api";
import type { Bill, Payment } from "./types";

export const LAST_PAYMENT_KEY = "ls_last_payment";

// Backend field names may vary; read whichever is present
export const billAmount = (b: Bill) => b.totalAmount ?? b.amount;
export const customerOf = (x: Bill | Payment) => x.customer ?? x.user ?? null;
export const trxOf = (p: Payment) => p.trxId ?? p.transactionId ?? null;

/** Start bKash checkout for a bill and send the browser to bKash. */
export async function startBkashPayment(billId: string) {
  const { data } = await api.post<{ id: string; bkashUrl: string }>("payments/initiate", { billId });
  try {
    sessionStorage.setItem(LAST_PAYMENT_KEY, data.id); // fallback for the result page
  } catch {}
  window.location.href = data.bkashUrl;
}
