"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import type { Notification } from "@/lib/types";
import { useApi } from "@/lib/use-api";

/** Topbar bell with unread count (polls every 30s). */
export function NotificationBell() {
  const unread = useApi<Notification[]>("notifications", { unreadOnly: true, page: 1, limit: 1 }, { refetchInterval: 30_000 });
  const count = unread.data?.meta?.total ?? 0;

  return (
    <Link href="/admin/notifications" aria-label={`Notifications (${count} unread)`} className="relative rounded-full p-2 hover:bg-muted">
      <Bell className="size-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
