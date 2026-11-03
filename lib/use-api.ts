"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api, type Query } from "./api";

/**
 * GET `path` with TanStack Query. Key is `[path, query]`, so `invalidates: [["zones"]]`
 * refetches every `zones` list. Pass `path = null` to wait (e.g. until an id is known).
 */
export function useApi<T>(path: string | null, query?: Query) {
  return useQuery({
    queryKey: [path, query ?? {}],
    queryFn: ({ signal }) => api.get<T>(path!, query, signal),
    enabled: !!path,
    placeholderData: keepPreviousData,
  });
}
