import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageMeta } from "@/lib/types";

export function Pagination({ meta, onPage }: { meta?: PageMeta; onPage: (page: number) => void }) {
  if (!meta || meta.total === 0) return null;
  return (
    <div className="flex items-center justify-between gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
      <span>
        Page {meta.page} of {Math.max(meta.totalPages, 1)} · {meta.total} total
      </span>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" disabled={!meta.hasPrev} onClick={() => onPage(meta.page - 1)} aria-label="Previous page">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" disabled={!meta.hasNext} onClick={() => onPage(meta.page + 1)} aria-label="Next page">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
