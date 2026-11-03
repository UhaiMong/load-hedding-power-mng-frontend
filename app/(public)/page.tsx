import { Hero } from "./home/Hero";
import { DemoCta, Features, HowItWorks } from "./home/Sections";

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
