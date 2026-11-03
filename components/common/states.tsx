import { Inbox, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function Loading({ className, label = "Loading…" }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground", className)}>
      <Spinner /> {label}
    </div>
  );
}

export function Empty({ message = "Nothing here yet." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-8 text-sm text-muted-foreground">
      <Inbox className="size-6" />
      {message}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-sm text-destructive">
      <TriangleAlert className="size-6" />
      {error?.message ?? "Something went wrong"}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/** Picks loading / error / empty / content for a TanStack query result. */
export function QueryState({
  query,
  empty,
  emptyMessage,
  children,
}: {
  query: { isPending: boolean; isError: boolean; error: Error | null; refetch: () => unknown };
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}) {
  if (query.isPending) return <Loading />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  if (empty) return <Empty message={emptyMessage} />;
  return <>{children}</>;
}
