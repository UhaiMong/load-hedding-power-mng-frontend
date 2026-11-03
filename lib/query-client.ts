import { MutationCache, QueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "./api";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
    mutationMeta: {
      /** Toast shown when the mutation succeeds. */
      success?: string;
      /** Query key prefixes refetched after success, e.g. [["zones"]]. */
      invalidates?: QueryKey[];
      /** Skip the automatic error toast (the form shows errors itself). */
      silent?: boolean;
    };
  }
}

export function makeQueryClient() {
  const client: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // don't retry 4xx (auth, validation, not found)
        retry: (count, err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500) && count < 2,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (_data, _vars, _ctx, mutation) => {
        const { success, invalidates } = mutation.meta ?? {};
        if (success) toast.success(success);
        invalidates?.forEach((queryKey) => client.invalidateQueries({ queryKey }));
      },
      onError: (err, _vars, _ctx, mutation) => {
        if (!mutation.meta?.silent) toast.error(err.message);
      },
    }),
  });
  return client;
}
