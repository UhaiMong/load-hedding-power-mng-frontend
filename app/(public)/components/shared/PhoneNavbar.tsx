"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  companyName,
  contactNo,
  fb_link,
  insta_link,
  tiktok_link,
} from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaPhone,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaHome,
  FaTools,
  FaBook,
  FaCommentDots,
} from "react-icons/fa";
import { Store } from "lucide-react";
import Image from "next/image";

const routes = [
  { path: "/", label: "Home", icon: FaHome, hasDropdown: false },
  { path: "#", label: "Importants", icon: FaTools, hasDropdown: true },
  { path: "/about", label: "About Us", icon: Store, hasDropdown: false },
  { path: "/blog", label: "Blog", icon: FaBook, hasDropdown: false },
  {
    path: "/contact",
    label: "Contact Us",
    icon: FaCommentDots,
    hasDropdown: false,
  },
];

export function PhoneNavbar({ services }: { services: any[] }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "#" ? pathname.includes("/services") : pathname === path;

  const closeAll = () => {
    setDrawerOpen(false);
    setServicesOpen(false);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      {/* ── Hamburger trigger ── */}
      <DrawerTrigger
        render={
          <Button
            variant="default"
            className="h-10 w-10 p-0 bg-primary hover:bg-primary/80 text-white rounded-lg shadow-md border-none active:scale-95 transition-all duration-200"
          />
        }
      >
        <FaBars className="w-4 h-4" />
      </DrawerTrigger>

      <DrawerContent
        className="border-none h-full rounded-none w-[85%] max-w-85 p-0 overflow-hidden flex flex-col"
        style={{
          background: "#0a0a0a",
          borderRight: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* ── Background glows ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full bg-primary/5 blur-[60px]" />
        </div>

        {/* ── Header ── */}
        <DrawerHeader className="relative z-10 px-5 pt-6 pb-5 border-b border-white/[0.07] shrink-0">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={closeAll}
              className="flex items-center justify-start gap-3 text-left"
            >
              <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                <Image
                  src="/logo/logo.png"
                  alt={`${companyName} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col justify-start leading-tight">
                <span className="text-xs font-black text-white tracking-tight uppercase">
                  {companyName}
                </span>
                <span className="text-[9px] text-primary font-bold tracking-[0.18em] uppercase">
                  Power Management System
                </span>
              </div>
            </Link>

            <DrawerClose
              render={
                <Button
                  variant="ghost"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                />
              }
            >
              <FaTimes className="w-3.5 h-3.5" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* ── Nav links ── */}
        <div className="relative z-10 flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.18em] px-3 mb-1">
            Navigation
          </p>

          {routes.map((route) => {
            const Icon = route.icon;
            const active = isActive(route.path);

            if (route.hasDropdown) {
              return (
                <div key={route.path}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-200
                      ${
                        active
                          ? "bg-primary/15 border-primary/25 text-white"
                          : "border-transparent text-white/60 hover:bg-white/4 hover:border-white/8 hover:text-white"
                      }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                        ${
                          active
                            ? "bg-primary/25 border border-primary/30 text-primary"
                            : "bg-white/5 border border-white/[0.07] text-white/40"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="flex-1 text-left text-sm font-semibold">
                      {route.label}
                    </span>
                    <FaChevronDown
                      className={`w-2.5 h-2.5 text-white/30 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Services accordion */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      servicesOpen
                        ? "max-h-200 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="mx-3 mt-1  bg-white/3 border border-white/6 rounded-xl p-2 flex flex-col gap-0.5">
                      {services?.map((service) => {
                        const slug = service.path ?? service.slug;
                        const path = `/services/${slug}`;
                        const sActive = pathname === path;
                        return (
                          <Link
                            key={slug}
                            href={path}
                            onClick={closeAll}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                              ${
                                sActive
                                  ? "text-primary bg-primary/10 border border-primary/15"
                                  : "text-white/50 hover:text-white hover:bg-white/5"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors
                                ${sActive ? "bg-primary" : "bg-white/20"}`}
                            />
                            {service.label ?? service.serviceName}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={route.path}
                href={route.path}
                onClick={closeAll}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-200
                  ${
                    active
                      ? "bg-primary/15 border-primary/25 text-white"
                      : "border-transparent text-white/60 hover:bg-white/4 hover:border-white/8 hover:text-white"
                  }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                    ${
                      active
                        ? "bg-primary/25 border border-primary/30 text-primary"
                        : "bg-white/5 border border-white/[0.07] text-white/40"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 text-sm font-semibold">
                  {route.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom: contact + social ── */}
        <div className="relative z-10 shrink-0 border-t border-white/[0.07] bg-black/30 backdrop-blur-md px-4 py-5 flex flex-col gap-4">
          {/* Phone */}
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <FaPhone className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] text-white/35 uppercase tracking-widest font-bold">
                Call Us Now
              </p>
              <p className="text-sm font-black text-white">{contactNo}</p>
            </div>
          </div>

          {/* Social + copyright */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[
                { Icon: FaFacebook, href: fb_link },
                { Icon: FaInstagram, href: insta_link },
                { Icon: FaTiktok, href: tiktok_link },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white hover:bg-primary/20 hover:border-primary/25 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
