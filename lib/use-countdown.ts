"use client";

import { useEffect, useState } from "react";

/** Simple seconds countdown, used for the "resend OTP" cooldown. */
export function useCountdown() {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return { left, start: (seconds = 60) => setLeft(seconds) };
}
