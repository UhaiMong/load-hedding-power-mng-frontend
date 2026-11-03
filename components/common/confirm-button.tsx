"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

/** Button that asks "are you sure?" before running `onConfirm` (closes when it resolves). */
export function ConfirmButton({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  onConfirm,
  pending,
  children,
  ...buttonProps
}: Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  title?: string;
  description?: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen} title={title} description={description}>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => onConfirm().then(() => setOpen(false), () => {})}
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
