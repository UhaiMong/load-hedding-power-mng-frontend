import type { PageMeta } from "./types";

export interface ApiFieldError {
  path?: string;
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: ApiFieldError[];

  constructor(status: number, message: string, errors: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }

  /** Machine code from the backend, e.g. "EMAIL_NOT_VERIFIED". */
  get code() {
    return this.errors.find((e) => e.code)?.code;
  }

  /** Validation message for one form field (backend Zod errors). */
  fieldError(name: string) {
    return this.errors.find((e) => e.path === name)?.message;
  }
}

export interface ApiResult<T> {
  data: T;
  message: string;
  meta?: PageMeta;
}

export type Query = Record<string, string | number | boolean | null | undefined>;

interface Options {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
}

/**
 * Browser-side fetch. Requests go to our own `/api/proxy/*` route, which adds the
 * Bearer token from the httpOnly cookie and forwards to the backend.
 */
export async function request<T = unknown>(
  path: string,
  { method = "GET", body, query, signal }: Options = {},
): Promise<ApiResult<T>> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const url = `/api/proxy/${path.replace(/^\//, "")}${qs.toString() ? `?${qs}` : ""}`;

  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      signal,
      headers: body !== undefined && !isForm ? { "Content-Type": "application/json" } : undefined,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "Network error. Please check your connection");
  }

  const json = (await res.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: T;
    meta?: PageMeta;
    errors?: ApiFieldError[];
  } | null;

  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.message ?? `Request failed (${res.status})`, json?.errors ?? []);
  }
  return { data: json.data as T, message: json.message ?? "", meta: json.meta };
}

export const api = {
  get: <T = unknown>(path: string, query?: Query, signal?: AbortSignal) => request<T>(path, { query, signal }),
  post: <T = unknown>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T = unknown>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T = unknown>(path: string) => request<T>(path, { method: "DELETE" }),
};
