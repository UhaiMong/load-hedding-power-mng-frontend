"use client";

import React from "react";
import { contactNo } from "@/lib/constants";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  className?: string;
  defaultMessage?: string;
  label?: string;
  variant?: "default" | "outline";
}

export function WhatsAppButton({
  className,
  defaultMessage,
  variant = "default",
  label = "Whatsapp Us",
}: WhatsAppButtonProps) {
  const message =
    defaultMessage ||
    "Hello! I am interested in your services. Can you help me?";

  const handleCaptureClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Dispatch global event to open floating WhatsApp popup
    window.dispatchEvent(new CustomEvent("open-global-whatsapp"));
  };

  return (
    <a
      href={`https://wa.me/${contactNo}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className={cn(
        "w-full md:w-fit flex justify-center cursor-pointer items-center gap-2 px-4 py-2.5 font-semibold transition rounded focus:ring-2 focus:ring-offset-2",
        variant === "default" &&
          "bg-secondary rounded-lg hover:bg-secondary/90 text-white shadow-lg focus:ring-secondary",
        variant === "outline" &&
          "rounded-lg border border-white/15 bg-white/4 text-white hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus:ring-primary",
        className,
      )}
      onClick={handleCaptureClick}
    >
      <FaWhatsapp className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
