import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Provider from "./Providers/Provider";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<Record<string, string | string[]>>;
}): Promise<Metadata> {
  const requestHeaders = await headers();
  const routeHeader =
    requestHeaders.get("x-pathname") ??
    requestHeaders.get("next-url") ??
    requestHeaders.get("x-url");
  const routeParams = await params;

  let pathname = "/";
  if (routeHeader) {
    try {
      pathname = new URL(routeHeader, "http://localhost").pathname;
    } catch {
      pathname = "/";
    }
  } else {
    const segments = Object.values(routeParams).flatMap((value) =>
      Array.isArray(value) ? value : [value],
    );
    if (segments.length)
      pathname = `/${segments.map(encodeURIComponent).join("/")}`;
  }

  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto")?.split(",")[0] ?? "https";
  const canonical = host
    ? new URL(pathname, `${protocol}://${host}`).toString()
    : new URL(
        pathname,
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      ).toString();

  return {
    title: {
      default: "Power Portal | Load Shedding & Outage Management",
      template: "%s | Power Portal",
    },
    description:
      "Report outages, see load-shedding schedules, track repairs and pay electricity bills with bKash.",
    alternates: { canonical },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <Provider>{children}</Provider>
        </TooltipProvider>
      </body>
    </html>
  );
}
