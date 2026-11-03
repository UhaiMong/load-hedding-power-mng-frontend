"use client";

import { useCallback, useState } from "react";
import { ApiError } from "./api";

/** Tracks pending/error state for one async action (form submit, button click). */
export function useSubmit() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    setPending(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(0, err instanceof Error ? err.message : "Something went wrong"));
      return undefined;
    } finally {
      setPending(false);
    }
  }, []);

  return { pending, error, run, setError };
}
