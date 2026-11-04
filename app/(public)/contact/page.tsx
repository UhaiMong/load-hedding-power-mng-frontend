import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  address,
  companyName,
  contactNo,
  contactStr,
  email,
  mapStr,
} from "@/lib/constants";
import { PageShell } from "../components/shared/PageShell";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact to ${companyName} for any problem. Call us: ${contactStr}`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const items = [
    {
      icon: Phone,
      label: "Hotline (24/7)",
      value: contactStr,
      href: `tel:${contactNo}`,
    },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: MapPin, label: "Office", value: address, href: mapStr },
  ];

  return (
    <PageShell
      title="Contact us"
      subtitle="For a power cut, report it from your dashboard for the fastest response."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {items.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex gap-3 rounded-lg p-4 ring-1 ring-foreground/10 hover:bg-muted"
            >
              <Icon className="size-5 shrink-0 text-primary" />
              <span>
                <span className="block text-xs text-muted-foreground">
                  {label}
                </span>
                {value}
              </span>
            </a>
          ))}
        </div>
        <ContactForm />
      </div>
    </PageShell>
  );
}
