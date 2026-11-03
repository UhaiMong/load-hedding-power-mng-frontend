"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useOptions } from "@/lib/use-options";

export function ReportDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const areas = useOptions("areas");
  const [areaId, setAreaId] = useState(user?.profile?.area?.id ?? "");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const report = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("description", description.trim());
      fd.append("areaId", areaId);
      if (image) fd.append("image", image);
      return api.post("outages/report", fd);
    },
    onSuccess: onClose,
    meta: { success: "Outage reported. We'll keep you posted.", invalidates: [["outages"]] },
  });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > 5 * 1024 * 1024) {
      e.target.value = "";
      return void toast.error("Image must be under 5 MB");
    }
    setImage(f);
  };
  const err = (n: string) => report.error?.fieldError(n);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Report an outage">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          report.mutate();
        }}
      >
        <FormField label="Area" error={err("areaId")}>
          <Select required value={areaId} onChange={(e) => setAreaId(e.target.value)} placeholder="Select area…" options={areas} />
        </FormField>
        <FormField label="What's happening?" error={err("description")}>
          <Textarea required minLength={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. No electricity since 8pm in Sector 10" />
        </FormField>
        <FormField label="Photo (optional)" error={err("image")}>
          <Input type="file" accept="image/*" className="py-1.5" onChange={onFile} />
        </FormField>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="lg" disabled={report.isPending}>{report.isPending ? "Sending…" : "Submit report"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
