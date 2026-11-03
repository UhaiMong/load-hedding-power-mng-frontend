import Link from "next/link";
import { Bell, CalendarClock, ChartColumn, Megaphone, Wallet, Wrench } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DEMO_ACCOUNTS, ROLE_LABEL } from "@/lib/constants";

const FEATURES = [
  { icon: Megaphone, title: "Report outages", text: "Tell us about a power cut in seconds, with a photo if you like." },
  { icon: CalendarClock, title: "Load-shedding schedule", text: "See planned cuts for your area before they happen." },
  { icon: Wrench, title: "Live repair tracking", text: "Follow your report from verification to restoration." },
  { icon: Wallet, title: "Pay bills with bKash", text: "Check your monthly bill and pay securely online." },
  { icon: Bell, title: "Instant notifications", text: "Get updates on outages, schedules and payments." },
  { icon: ChartColumn, title: "Reliability analytics", text: "Staff track outages, areas and technician performance." },
];

const STEPS = [
  { n: 1, title: "Create your account", text: "Register with your meter number and verify your email." },
  { n: 2, title: "Pick your area", text: "Set your area in your profile to see the right schedules." },
  { n: 3, title: "Report & pay", text: "Report outages, track repairs and pay bills in one place." },
];

const section = "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6";

export function Features() {
  return (
    <section className={section}>
      <h2 className="text-center text-2xl font-bold">Everything about your power, in one place</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
        A single portal for customers, operators, technicians and zone managers.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg p-5 ring-1 ring-foreground/10">
            <Icon className="size-6 text-primary" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-muted/40">
      <div className={section}>
        <h2 className="text-center text-2xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-lg bg-background p-5 ring-1 ring-foreground/10">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoCta() {
  return (
    <section className={section}>
      <div className="rounded-xl bg-primary p-8 text-center text-primary-foreground">
        <h2 className="text-2xl font-bold">Try it with a demo account</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm opacity-90">
          One-click demo login for every role: {DEMO_ACCOUNTS.map((a) => ROLE_LABEL[a.role]).join(", ")}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/auth/login" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Demo login
          </Link>
          <Link href="/auth/register" className={buttonVariants({ size: "lg", variant: "outline", className: "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" })}>
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
