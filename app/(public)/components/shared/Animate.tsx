"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

export interface AnimateProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onTransitionEnd"
> {
  show?: boolean;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  index?: number;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function getTransform(direction: Direction, distance: number): string {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(-${distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(-${distance}px)`;
    default:
      return "none";
  }
}

export function Animate({
  children,
  show,
  direction = "up",
  distance = 24,
  duration = 700,
  delay = 0,
  index = 0,
  staggerDelay = 0,
  once = false,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  className,
  style,
  ...rest
}: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isControlled = show !== undefined;

  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(show ?? false);
  const [visible, setVisible] = useState(show ?? false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isControlled) return;
    if (show) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
  }, [isControlled, show]);

  useEffect(() => {
    if (isControlled) return;
    const node = ref.current;
    if (!node) return;

    if (reducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isControlled, once, threshold, rootMargin, reducedMotion]);

  if (isControlled && !mounted) return null;

  const active = isControlled ? visible : inView;
  const totalDelay = delay + index * staggerDelay;

  const computedStyle: CSSProperties = reducedMotion
    ? { ...style, opacity: 1, transform: "none" }
    : {
        ...style,
        opacity: active ? 1 : 0,
        transform: active ? undefined : getTransform(direction, distance),
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${totalDelay}ms`,
        transitionTimingFunction: EASE,
        willChange: active ? "auto" : "opacity, transform",
      };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={computedStyle}
      onTransitionEnd={() => {
        if (isControlled && show === false) setMounted(false);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
