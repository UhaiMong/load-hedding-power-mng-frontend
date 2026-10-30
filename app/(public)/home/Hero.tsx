"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Animate } from "../components/shared/Animate";
import CallNow from "../components/shared/CallNow";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface TrustItem {
  badge: string;
  info: string;
}

const slides: Slide[] = [
  {
    image: "/banner/banner1.jpg",
    title: "24/7 Days a week awake for servicing your support",
    subtitle: "বাংলাদেশ বিদ্যুৎ উন্নয়ন বোর্ড গণপ্রজাতন্ত্রী বাংলাদেশ সরকার",
  },

  {
    image: "/banner/banner2.jpg",
    title: "High-Rise Electrical Maintenance",
    subtitle: "বাংলাদেশ বিদ্যুৎ উন্নয়ন বোর্ড গণপ্রজাতন্ত্রী বাংলাদেশ সরকার",
  },

  {
    image: "/banner/banner3.jpg",
    title: "Transform Your Home",
    subtitle: "বাংলাদেশ বিদ্যুৎ উন্নয়ন বোর্ড গণপ্রজাতন্ত্রী বাংলাদেশ সরকার",
  },
];

const trustMatrix: TrustItem[] = [
  { badge: "Expert", info: "Technicians & Team" },
  { badge: "Granteed", info: "100% Quality Ensured" },
  { badge: "Time", info: "First Response" },
  { badge: "24/7", info: "Days Support" },
];

const AUTOPLAY_MS = 10000;

export function Hero() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return clearTimer;
  }, [autoPlay, clearTimer]);

  const goTo = useCallback(
    (index: number) => {
      setAutoPlay(false);
      clearTimer();
      setActive(index);
    },
    [clearTimer],
  );

  const next = useCallback(
    () => goTo((active + 1) % slides.length),
    [active, goTo],
  );
  const prev = useCallback(
    () => goTo((active - 1 + slides.length) % slides.length),
    [active, goTo],
  );

  return (
    <section
      aria-label="Hero slider"
      className="relative w-full overflow-hidden bg-destructive"
    >
      {/* Background slides — full-bleed backdrop, kept dark behind text */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className="absolute inset-0 transition-opacity duration-1200ms ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: index === active ? 1 : 0 }}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        {/* Readability overlay — dark everywhere. The card carries the
            "clear image" role, so the backdrop stays dark for text contrast. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-foreground/90 via-foreground/70 to-foreground/40"
        />
      </div>

      {/* Content container — flows naturally, no fixed height */}
      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full flex-col px-4 pb-10 pt-18 sm:px-10 lg:justify-center lg:pb-36 lg:pt-8">
        {/* Slide indicators */}
        <div className="absolute left-6 top-20 flex gap-2 sm:left-10 sm:top-24 lg:top-8">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === active
                  ? "w-8 bg-primary-foreground"
                  : "w-3 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
            />
          ))}
        </div>

        {/* Main grid: card on top (mobile) / card on right (desktop) */}
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* IMAGE CARD — order-1 on mobile (top), order-2 on desktop (right) */}
          <div className="order-1 w-full lg:order-2 lg:col-span-6">
            <div className="relative mx-auto aspect-16/10 w-full max-w-md lg:aspect-16/10 lg:max-w-none">
              {/* Rotated backing frame — desktop only */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 hidden translate-x-3 translate-y-3 rotate-2 rounded-2xl border border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur-sm lg:block"
              />

              {/* Main image */}
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-primary-foreground/20">
                {slides.map((slide, index) => (
                  <Image
                    key={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className={`object-cover transition-opacity duration-1200ms ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      index === active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}

                {/* Corner accents — desktop only */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-4 hidden size-10 rounded-tl-lg border-l-2 border-t-2 border-destructive lg:block"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-4 right-4 hidden size-10 rounded-br-lg border-b-2 border-r-2 border-destructive lg:block"
                />

                {/* Prev/Next — bottom-LEFT corner, both mobile & desktop */}
                <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous slide"
                    className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-destructive text-white backdrop-blur-md transition-colors duration-300 hover:bg-primary/80"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next slide"
                    className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-destructive text-white backdrop-blur-md transition-colors duration-300 hover:bg-primary/80"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TEXT — order-2 on mobile, order-1 on desktop (left) */}
          <div className="order-2 w-full text-center lg:order-1 lg:col-span-6 lg:text-start">
            <Animate key={`title-${active}`} direction="up" duration={600}>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-white capitalize">
                {slides[active].title}
              </h1>
            </Animate>
            <Animate
              key={`subtitle-${active}`}
              direction="up"
              duration={600}
              delay={120}
            >
              <p className="mt-3 text-sm text-white sm:mt-4 sm:text-lg font-bold">
                {slides[active].subtitle}
              </p>
            </Animate>
            <Animate direction="up" duration={600} delay={220}>
              <div className="mt-5 flex justify-center lg:justify-start">
                <CallNow className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium bg-destructive text-white shadow-lg transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] sm:text-base" />
              </div>
            </Animate>
          </div>
        </div>

        {/* TRUST MATRIX — in-flow on mobile, pinned to bottom on desktop */}
        <div className="mt-10 rounded-2xl bg-neutral-200/95 px-6 py-6 backdrop-blur-md lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:rounded-none lg:border-t lg:border-neutral-200 lg:px-0 lg:py-6">
          <div className="lg:pointer-events-auto mx-auto grid grid-cols-2 gap-y-6 lg:max-w-6xl lg:grid-cols-4 lg:gap-0 lg:px-10">
            {trustMatrix.map((item) => (
              <div
                key={item.info}
                className="flex flex-col items-center text-center lg:border-l lg:border-neutral-200 lg:first:border-l-0"
              >
                <span className="text-xl font-semibold text-destructive sm:text-2xl lg:text-3xl">
                  {item.badge}
                </span>
                <span className="mt-1 text-xs text-neutral-800 sm:text-sm">
                  {item.info}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev/Next — desktop only, absolute bottom-right */}
      <div className="absolute bottom-32 left-8 z-20 hidden flex-col gap-2">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md transition-colors duration-300 hover:bg-primary-foreground/20"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md transition-colors duration-300 hover:bg-primary-foreground/20"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
