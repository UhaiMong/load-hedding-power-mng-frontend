"use client";

import type { Ref } from "./types";
import { useApi } from "./use-api";

/** Select options from a list endpoint, e.g. useOptions("zones"). */
export function useOptions(path: string | undefined) {
  const res = useApi<Ref[]>(path ?? null, { limit: 100, sortBy: "name", order: "asc" });
  return res.data?.data.map((r) => ({ value: r.id, label: `${r.name} (${r.code})` }));
}
