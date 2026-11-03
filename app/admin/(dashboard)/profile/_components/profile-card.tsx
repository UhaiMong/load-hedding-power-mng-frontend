"use client";

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { ROLE_LABEL } from "@/lib/constants";
import type { User } from "@/lib/types";

export function ProfileCard({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const p = user.profile;

  const avatar = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      return api.post("users/me/avatar", fd);
    },
    onSuccess: () => refreshUser(),
    meta: { success: "Avatar updated" },
  });

  const availability = useMutation({
    mutationFn: (isAvailable: boolean) => api.patch("users/me/availability", { isAvailable }),
    onSuccess: () => refreshUser(),
    meta: { success: "Availability updated" },
  });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return void toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return void toast.error("Image must be under 5 MB");
    avatar.mutate(file);
  };

  const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const details: [string, string | null | undefined][] = [
    ["Phone", p?.phone],
    ["Address", p?.address],
    ["Meter no.", p?.meterNumber],
    ["Area", p?.area ? `${p.area.name} (${p.area.feeder.name})` : null],
    ["Zone", p?.zone?.name],
    ["Joined", new Date(user.createdAt).toLocaleDateString()],
  ];

  return (
    <section className="rounded-lg bg-background p-5 ring-1 ring-foreground/10">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={avatar.isPending}
          className="group relative size-20 shrink-0 overflow-hidden rounded-full bg-muted text-xl font-semibold"
          aria-label="Change avatar"
        >
          {user.image ? <img src={user.image} alt="" className="size-full object-cover" /> : initials}
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100">
            {avatar.isPending ? <Spinner /> : <Camera className="size-5" />}
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />

        <div className="text-center sm:text-left">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge tone="blue">{ROLE_LABEL[user.role]}</Badge>
            {user.emailVerified && <Badge tone="green">Email verified</Badge>}
            {p?.isBusy && <Badge tone="yellow">On a job</Badge>}
          </div>
        </div>

        {user.role === "TECHNICIAN" && (
          <label className="flex items-center gap-2 text-sm font-medium sm:ml-auto">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={!!p?.isAvailable}
              disabled={availability.isPending}
              onChange={(e) => availability.mutate(e.target.checked)}
            />
            On duty
          </label>
        )}
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
