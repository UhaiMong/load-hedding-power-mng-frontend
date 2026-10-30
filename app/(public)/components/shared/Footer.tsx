"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  FaCertificate,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

import {
  address,
  companyName,
  contactNo,
  contactStr,
  email,
  fb_link,
  govRegistrationNo,
  insta_link,
  mapStr,
  tiktok_link,
} from "@/lib/constants";
import Image from "next/image";

const routes = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/about", label: "About Us" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact Us" },
  { path: "/privacy-policy", label: "Privacy Policy" },
];

const socialLinks = [
  { href: fb_link, icon: FaFacebook, label: "Facebook" },
  { href: insta_link, icon: FaInstagram, label: "Instagram" },
  { href: tiktok_link, icon: FaTiktok, label: "TikTok" },
];

export default function Footer() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <footer className="relative isolate overflow-hidden text-white">
      {/* <Image
        src="/logo/logo.png"
        alt="Footer brand logo image"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      /> */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#1b1b5e]" />

      <div className="site-container py-6 md:py-10 lg:py-14 pt-12 md:pt-16">
        <div className="grid gap-5 lg:grid-cols-12">
          {/* 1: Brand */}
          <div className="space-y-4 lg:col-span-3">
            <Link
              href="/"
              aria-label={`${companyName} home`}
              className="inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Image
                src="/logo/logo.png"
                alt=""
                width={80}
                height={80}
                className="object-contain bg-white rounded-r-2xl"
              />
              <div className="flex flex-col gap-2">
                <span className="text-sm leading-tight font-bold">
                  {companyName}
                </span>
                <strong className="text-[10px]">Power Management System</strong>
              </div>
            </Link>

            <p className="text-sm text-white/80">
              PBD helps you stay informed and prepared with reliable power
              outage updates and management.
            </p>

            <p className="flex items-center gap-2 text-sm font-medium">
              <FaCertificate aria-hidden className="size-4 text-accent" />
              Reg No: {govRegistrationNo}
            </p>

            <ul className="flex items-center gap-2">
              {socialLinks
                .filter(({ href }) => href)
                .map(({ href, icon: Ico, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className="grid size-10 place-items-center rounded-full bg-white/10 transition duration-300 hover:-translate-y-0.5 hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <Ico aria-hidden className="size-4" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* 2: Quick navigation */}
          <nav aria-labelledby="footer-nav-title" className="lg:col-span-2">
            <h2
              id="footer-nav-title"
              className="mb-4 text-base font-bold after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-primary"
            >
              Quick Links
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
              {routes.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    href={path}
                    aria-current={isActive(path) ? "page" : undefined}
                    className={`inline-flex items-center gap-1 text-sm transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isActive(path)
                        ? "font-semibold text-accent"
                        : "text-white/80"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3: Services */}
          <nav
            aria-labelledby="footer-services-title"
            className="lg:col-span-4"
          >
            <h2
              id="footer-services-title"
              className="mb-4 text-base font-bold after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-primary"
            >
              Important Links
            </h2>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 lg:grid-cols-2">
              {[
                { path: "https://bpdb.gov.bd/", label: "PBD Help Desk" },
                { path: "https://bpdb.gov.bd/", label: "New Installation" },
                {
                  path: "https://bpdb.gov.bd/",
                  label: "Meter Replacement Service",
                },
                { path: "https://bpdb.gov.bd/", label: "Power Box Fixing" },
                {
                  path: "https://bpdb.gov.bd/",
                  label: "Line Destroyed Repaire",
                },
                {
                  path: "https://bpdb.gov.bd/",
                  label: "Commercial Electrical",
                },
                {
                  path: "https://bpdb.gov.bd/",
                  label: "Residential Electrical",
                },
                { path: "https://bpdb.gov.bd/", label: "Notice Board" },
              ].map(({ path, label }) => {
                const href = `/services/${path}`;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      aria-current={isActive(href) ? "page" : undefined}
                      className={`group inline-flex items-start gap-1.5 text-sm transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        isActive(href)
                          ? "font-semibold text-accent"
                          : "text-white/80"
                      }`}
                    >
                      <ArrowUpRight
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 4: Contact */}
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-base font-bold after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
              Get In Touch
            </h2>
            <address className="space-y-3 text-sm not-italic">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value: address,
                  href: `https://www.google.com/maps?q=${mapStr}`,
                  method: "map",
                  external: true,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: email,
                  href: `mailto:${email}`,
                  method: "email",
                },
              ].map(({ icon: Ico, label, value, href, method, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="group flex items-center gap-3 text-white/80 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-accent transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Ico aria-hidden className="size-4" />
                  </span>
                  <span className="min-w-0 wrap-break-word">
                    <span className="sr-only">{label}: </span>
                    {value}
                    {external && (
                      <span className="sr-only"> (opens in a new tab)</span>
                    )}
                  </span>
                </a>
              ))}
              {/* call with tracker */}
              <a
                href={`tel:${contactNo}`}
                className="group flex items-center gap-3 text-white/80 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-accent transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 wrap-break-word">
                  <span className="sr-only">Call: </span>
                  {contactStr}
                </span>
              </a>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col-reverse items-center gap-2 border-t border-white/15 py-5 text-center text-xs text-white/70 sm:flex-row sm:justify-between sm:text-left md:mt-12 md:text-sm">
          <p>
            Design & Developed by{" "}
            <a
              href="https://uhaimong.databist.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Uhai Mong
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <p>
            &copy; {new Date().getFullYear()} {companyName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
