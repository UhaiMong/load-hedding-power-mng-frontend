import type { Metadata } from "next";
import { companyName, email } from "@/lib/constants";
import { PageShell } from "../components/shared/PageShell";

export const metadata: Metadata = { title: "Privacy Policy" };

const SECTIONS = [
  ["What we collect", "Your name, email, phone, address, meter number and area, plus outage reports and payment records."],
  ["How we use it", "To manage your account, plan schedules, fix outages, bill you and send service notifications."],
  ["Payments", "Payments are processed by bKash. We never see or store your bKash PIN."],
  ["Security", "Sessions use secure httpOnly cookies, and staff actions are recorded in audit logs."],
  ["Your rights", "You can update your profile or delete your account at any time from your dashboard."],
];

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy policy" subtitle={`How ${companyName} handles your data.`}>
      {SECTIONS.map(([title, text]) => (
        <section key={title}>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-muted-foreground">{text}</p>
        </section>
      ))}
      <p>
        Questions? Email{" "}
        <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
          {email}
        </a>
        .
      </p>
    </PageShell>
  );
}
