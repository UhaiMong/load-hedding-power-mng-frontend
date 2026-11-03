import type { Metadata } from "next";
import { PageShell } from "../components/shared/PageShell";

export const metadata: Metadata = { title: "Blog" };

const POSTS = [
  {
    title: "How load-shedding schedules are planned",
    date: "2026-10-12",
    text: "When supply falls short, feeders are rotated by priority so no area is cut for too long. Hospitals and critical loads are protected first.",
  },
  {
    title: "5 ways to save electricity at home",
    date: "2026-09-28",
    text: "Switch to LED bulbs, set your AC to 25°C, unplug idle chargers, use appliances off-peak and keep your fridge door closed.",
  },
  {
    title: "What to do during a power cut",
    date: "2026-09-05",
    text: "Report the outage from your dashboard, switch off heavy appliances and keep a torch ready. You'll be notified when power is restored.",
  },
];

export default function BlogPage() {
  return (
    <PageShell title="Blog" subtitle="Tips and updates from our team.">
      <div className="grid gap-4 md:grid-cols-3">
        {POSTS.map((p) => (
          <article key={p.title} className="rounded-lg p-5 ring-1 ring-foreground/10">
            <time className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</time>
            <h2 className="mt-1 font-semibold">{p.title}</h2>
            <p className="mt-2 text-muted-foreground">{p.text}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
