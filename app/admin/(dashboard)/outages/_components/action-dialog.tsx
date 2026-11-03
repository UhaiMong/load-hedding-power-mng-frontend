"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { fromLocalInput } from "@/lib/format";

export interface ActionField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "datetime";
  options?: { value: string; label: string }[];
  required?: boolean;
}

/** Small form dialog for one outage action; empty values are left out of the body. */
export function ActionDialog({
  title,
  description,
  fields,
  initial,
  submitLabel,
  success,
  send,
  onClose,
}: {
  title: string;
  description?: string;
  fields: ActionField[];
  initial?: Record<string, string>;
  submitLabel: string;
  success: string;
  send: (body: Record<string, string>) => Promise<unknown>;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial ?? {});
  const action = useMutation({
    mutationFn: () => {
      const body: Record<string, string> = {};
      for (const f of fields) {
        const v = values[f.name]?.trim();
        if (v) body[f.name] = f.type === "datetime" ? fromLocalInput(v) : v;
      }
      return send(body);
    },
    onSuccess: onClose,
    meta: { success, invalidates: [["outages"]] },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title={title} description={description}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          action.mutate();
        }}
      >
        {fields.map((f) => {
          const common = {
            required: f.required,
            value: values[f.name] ?? "",
            onChange: (e: { target: { value: string } }) => setValues((s) => ({ ...s, [f.name]: e.target.value })),
          };
          return (
            <FormField key={f.name} label={f.label} error={action.error?.fieldError(f.name)}>
              {f.type === "select" ? (
                <Select {...common} placeholder="Select…" options={f.options} />
              ) : f.type === "textarea" ? (
                <Textarea {...common} />
              ) : (
                <Input {...common} type={f.type === "datetime" ? "datetime-local" : "text"} />
              )}
            </FormField>
          );
        })}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="lg" disabled={action.isPending}>{action.isPending ? "Working…" : submitLabel}</Button>
        </div>
      </form>
    </Dialog>
  );
}
