"use client";

import { contactNo } from "@/lib/constants";
import { Phone } from "lucide-react";

export default function CallNow({ className }: { className?: string }) {
  return (
    <a
      href={`tel:${contactNo}`}
      className={`group relative z-20 flex w-full items-center justify-center gap-2 overflow-hidden px-6 py-3 text-[13px] font-extrabold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 md:w-fit ${className ?? ""}`}
    >
      {/* shine sweep on hover, replacing the old ::before pseudo-element */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-[-60%] h-[200%] w-2/5 skew-x-[-20deg] bg-white/25 transition-[left] duration-500 ease-out group-hover:left-[140%]"
      />
      <Phone className="h-4 w-4 shrink-0" fill="currentColor" strokeWidth={0} />
      Call Us
    </a>
  );
}
