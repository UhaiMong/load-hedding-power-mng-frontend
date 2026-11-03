import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Gauge, Megaphone, Receipt, Wrench, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageShell } from "../components/shared/PageShell";

export const metadata: Metadata = { title: "Services" };

const SERVICES = [
  { icon: Megaphone, title: "Outage reporting", text: "Report a power cut online and track it until power is back." },
  { icon: CalendarClock, title: "Planned schedules", text: "Maintenance and load-shedding times for every feeder." },
  { icon: Wrench, title: "Field repairs", text: "Technicians dispatched by availability and zone." },
  { icon: Receipt, title: "Billing", text: "Monthly bills calculated on a fair tiered tariff." },
  { icon: Zap, title: "bKash payments", text: "Pay your bill online in a few taps." },
  { icon: Gauge, title: "Load monitoring", text: "Live feeder load readings to prevent overloads." },
];

export default function ServicesPage() {
  return (
    <PageShell title="Our services" subtitle="What you can do with the power management portal.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg p-5 ring-1 ring-foreground/10">
            <Icon className="size-6 text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <Link href="/auth/register" className={buttonVariants({ size: "lg" })}>
        Get started
      </Link>
    </PageShell>
  );
}
