"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  FileText,
  Wrench,
  LayoutDashboard,
  ArrowRight,
  Terminal,
  Phone,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { usePathname } from "next/navigation";
import { PhoneNavbar } from "./PhoneNavbar";
import {
  address,
  companyName,
  contactNo,
  contactStr,
  email,
  fb_link,
  insta_link,
  mapStr,
  tiktok_link,
} from "@/lib/constants";
import { signOut, useSession } from "next-auth/react";
import { cn } from "cn";
import Image from "next/image";
import { WhatsAppButton } from "./WhatsAppButton";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { label: "Importants", dropdown: true },
  { path: "/about", label: "About Us" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact Us" },
];

const TICKER_ITEMS = [
  {
    icon: <Phone className="h-3 w-3 shrink-0 text-primary" />,
    text: contactStr,
    url: false,
    link: "",
  },
  {
    icon: <MdLocationOn className="h-3 w-3 shrink-0 text-primary" />,
    text: address,
    url: true,
    link: mapStr,
  },
];

const SOCIAL_LINKS = [
  { href: fb_link, Icon: FaFacebook, label: "Facebook" },
  { href: insta_link, Icon: FaInstagram, label: "Instagram" },
  { href: tiktok_link, Icon: FaTiktok, label: "TikTok" },
];

const ADMIN_LINKS = [
  {
    href: "/dashboard",
    Icon: LayoutDashboard,
    label: "Dashboard",
    cls: "text-red-400",
  },
  {
    href: "/dashboard/services/add",
    Icon: Wrench,
    label: "Service",
    cls: "text-emerald-400",
  },
  {
    href: "/dashboard/blog/add",
    Icon: FileText,
    label: "Blog",
    cls: "text-sky-400",
  },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (p: string) => pathname === p;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  const importantLinks = [
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
  ];

  const itemCls = (active: boolean) =>
    cn(
      "group relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-2 text-[12.5px] font-bold tracking-wide transition-colors duration-200 xl:px-3.5 xl:text-[13px]",
      scrolled
        ? active
          ? "text-white"
          : "text-white/75 hover:text-white"
        : active
          ? "text-primary"
          : "text-secondary hover:text-primary",
    );

  const underline = (active: boolean) => (
    <span
      className={`absolute bottom-0 left-1/2 h-0.5 w-[60%] -translate-x-1/2 rounded-full transition-transform bg-primary duration-200 ${
        active
          ? scrolled
            ? "bg-white"
            : "scale-x-100"
          : "scale-x-0 group-hover:scale-x-100 bg=primary"
      }`}
    />
  );

  return (
    <>
      {/* ── Admin Bar — NOT sticky ── */}
      {session?.user && (
        <div className="border-b border-white/5 bg-neutral-950/95 backdrop-blur">
          <div className="site-container flex min-h-10 flex-wrap items-center justify-between py-1">
            <div className="flex items-center gap-1">
              <div className="mr-2 hidden items-center gap-2 border-r border-white/10 pr-5 md:flex">
                <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md border border-primary/30 bg-primary/15">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-[10.5px] font-bold tracking-[.08em] text-white">
                  ACCESS BAR
                </span>
              </div>

              {ADMIN_LINKS.map(({ href, Icon, label, cls }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 transition-all hover:bg-white/5 hover:text-white"
                >
                  <Icon className={`h-3.5 w-3.5 ${cls}`} />
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/5 px-3 py-1 md:flex">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="font-mono text-[10px] tracking-[.08em] text-gray-500">
                  SYS.NORMAL
                </span>
              </div>

              <div className="hidden items-center gap-2 border-l border-white/10 pl-3 sm:flex">
                <span className="font-mono text-[11px] font-semibold text-white">
                  {session?.user?.name || "admin"}
                </span>
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-[10px] font-black text-primary-foreground">
                    AD
                  </div>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-neutral-950 bg-green-500" />
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="group flex cursor-pointer items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 font-mono text-xs font-bold text-red-400 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
                exit()
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ticker Bar — also plain flow, also not scroll-conditional ── */}
      <div className="hidden border-b border-primary bg-foreground lg:flex">
        <div className="flex h-8.5 w-full items-center overflow-hidden">
          <div className="flex h-full shrink-0 items-center gap-2 bg-primary/20 px-4">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              className="fill-muted"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="text-[10px] font-black tracking-[.2em] text-muted">
              24/7 Available
            </span>
          </div>

          <div className="flex flex-1 items-center overflow-hidden ml-2.5">
            <div className="flex gap-4 animate-[marquee_28s_linear_infinite] whitespace-nowrap">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-[11.5px] text-white/50"
              >
                <MdEmail className="h-3 w-3 shrink-0 text-primary" />
                {email}
              </a>
              {TICKER_ITEMS.map(({ icon, text, url, link }, i) => {
                return (
                  <div key={i}>
                    {url ? (
                      <a
                        href={link}
                        target="_blank"
                        className="flex items-center gap-2 text-[11.5px] text-white/50"
                      >
                        {icon}
                        {text}
                      </a>
                    ) : (
                      <a
                        href={`tel:${contactNo}`}
                        className="flex items-center gap-2 text-[11.5px] text-white/50"
                      >
                        {icon}
                        {text}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex h-full shrink-0 items-center gap-2 border-l border-primary/10 px-4">
            <small className="text-muted">Follow Us: </small>
            {SOCIAL_LINKS.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.07] bg-primary text-primary-foreground transition-transform duration-200 hover:scale-110"
              >
                <Icon className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Nav — the ONLY sticky element. ── */}
      <nav
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-accent-foreground"
            : "bg-accent-foreground shadow-[0_2px_20px_rgba(0,0,0,0.07)] ring-1 ring-primary/15"
        }`}
      >
        <div className="h-0.75 bg-linear-to-r from-primary via-primary/60 to-primary" />

        <div className="site-container">
          <div className="flex items-center gap-2 py-2 sm:gap-3 md:py-2.5">
            <Link
              href="/"
              className="mr-1 flex min-w-0 flex-1 items-center gap-2 no-underline sm:mr-3 sm:gap-3 lg:mr-4 lg:flex-none"
            >
              <div
                className={cn(
                  "relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 bg-white sm:h-11.5 sm:w-11.5",
                  scrolled ? "border-primary/40" : "border-primary/30",
                )}
              >
                <Image
                  src="/logo/logo.png"
                  alt={`${companyName} Logo`}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-[11px] font-black uppercase leading-tight tracking-[.04em] min-[400px]:text-xs sm:text-[13px] md:text-sm md:tracking-[.06em]",
                    scrolled ? "text-white" : "text-secondary",
                  )}
                >
                  {companyName}
                </p>
                <p
                  className={cn(
                    "text-[8px] font-bold tracking-[.18em] sm:tracking-[.28em] lg:text-[9px]",
                    scrolled ? "text-white" : "text-primary/60",
                  )}
                >
                  Power Management System
                </p>
              </div>
            </Link>

            <div
              className={cn(
                "hidden h-8 w-px shrink-0 lg:block",
                scrolled ? "bg-white/15" : "bg-secondary/15",
              )}
            />

            <ul className="hidden flex-1 items-center justify-center lg:flex">
              {NAV_LINKS.map((route) => {
                if (route.dropdown)
                  return (
                    <li
                      key="importants"
                      // no "relative" here, so the dropdown anchors to the sticky <nav> and can span the full width
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <button
                        type="button"
                        aria-expanded={servicesOpen}
                        className={cn(
                          itemCls(pathname.startsWith("/services")),
                          "cursor-pointer border-0 bg-transparent",
                        )}
                      >
                        Importants
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            servicesOpen && "rotate-180",
                          )}
                        />
                        {underline(pathname.startsWith("/services"))}
                      </button>

                      {servicesOpen && (
                        <div className="max-w-4xl mx-auto max-h-[calc(100vh-14rem)] absolute inset-x-0 top-full z-50 bg-accent-foreground p-4 rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
                          {/* hover bridge: keeps the menu open while the mouse crosses the nav padding */}
                          <div className="absolute inset-x-0 bottom-full h-4" />

                          <div className="border-b border-border">
                            <div className="w-full py-5">
                              {/* Header */}
                              <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-4">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="text-[11px] font-black tracking-[.12em] text-white">
                                      OUR IMPORTANT Links
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {importantLinks.length} Links Available
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* 5-column grid */}
                              <div className="grid grid-cols-4 gap-1 overflow-y-auto">
                                {importantLinks.map((item) => {
                                  const href = `/services/${item.path}`;
                                  const active = isActive(href);
                                  return (
                                    <Link
                                      key={item.path}
                                      href={href}
                                      onClick={() => setServicesOpen(false)}
                                      className={cn(
                                        "group flex items-start gap-3 rounded-xl px-3 py-2.5 no-underline transition-colors text-white",
                                      )}
                                    >
                                      {item.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                return (
                  <li key={route.path}>
                    <Link
                      href={route.path!}
                      className={itemCls(isActive(route.path!))}
                    >
                      {route.label}
                      {underline(isActive(route.path!))}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ml-1 hidden shrink-0 lg:flex">
              <WhatsAppButton
                className="bg-green-700 hover:bg-green-600 rounded-lg px-3 font-black text-white shadow-xl focus:ring-secondary active:translate-y-0.5 xl:px-4"
                defaultMessage="I want emergency contact"
              />
            </div>

            <div className="ml-auto shrink-0 lg:hidden">
              <PhoneNavbar services={importantLinks} />
            </div>
          </div>
        </div>

        <div
          className={`h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </nav>
    </>
  );
}
