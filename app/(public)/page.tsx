import type { Metadata } from "next";
import { Hero } from "./home/Hero";
import { DemoCta, Features, HowItWorks } from "./home/Sections";

export const metadata: Metadata = {
  title: "Load Shedding Power Management",
  description:
    "Plan ahead for load shedding with tools to manage your power usage and stay prepared.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <DemoCta />
    </main>
  );
}
