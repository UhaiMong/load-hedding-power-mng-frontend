import type { Metadata } from "next";
import { companyName } from "@/lib/constants";
import { PageShell } from "../components/shared/PageShell";

export const metadata: Metadata = { title: "About Us" };

const VALUES = [
  ["Transparency", "Load-shedding schedules are planned fairly and published in advance."],
  ["Speed", "Every outage report is verified and assigned to the nearest available technician."],
  ["Reliability", "We track every feeder and area to reduce repeat outages."],
];

export default function AboutPage() {
  return (
    <PageShell title="About us" subtitle={`${companyName} keeps the lights on and keeps you informed.`}>
      <p>
        We manage electricity distribution across our zones: substations, feeders and the areas they serve. This portal
        connects customers with our operators, technicians and zone managers so power cuts are reported, scheduled and fixed
        faster.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {VALUES.map(([title, text]) => (
          <div key={title} className="rounded-lg p-5 ring-1 ring-foreground/10">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
