"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { EnumBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { fmtDateTime } from "@/lib/format";
import type { Notification } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

const isRead = (n: Notification) => n.isRead ?? !!n.readAt;

// Where a notification should take the user, if anywhere
function linkOf(n: Notification) {
  if (n.link?.startsWith("/")) return n.link;
  const d = n.data ?? {};
  if (typeof d.outageId === "string") return `/admin/outages/${d.outageId}`;
  if (d.scheduleId) return "/admin/schedules";
  if (d.billId) return "/admin/bills";
  if (d.paymentId) return "/admin/payments";
  return null;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const list = useApi<Notification[]>("notifications", { unreadOnly: unreadOnly || undefined, page, limit: 10 });
  const rows = list.data?.data ?? [];

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`notifications/${id}/read`),
    meta: { invalidates: [["notifications"]] },
  });
  const markAll = useMutation({
    mutationFn: () => api.patch("notifications/read-all"),
    meta: { success: "All notifications marked as read", invalidates: [["notifications"]] },
  });

  const open = (n: Notification) => {
    if (!isRead(n)) markRead.mutate(n.id);
    const href = linkOf(n);
    if (href) router.push(href);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        actions={
          <Button size="lg" variant="outline" disabled={markAll.isPending} onClick={() => markAll.mutate()}>
            <CheckCheck /> Mark all read
          </Button>
        }
      />

      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        <div className="flex gap-1 border-b p-2">
          {[false, true].map((u) => (
            <button
              key={String(u)}
              type="button"
              onClick={() => {
                setUnreadOnly(u);
                setPage(1);
              }}
              className={cn("rounded-md px-3 py-1.5 text-sm font-medium", unreadOnly === u ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
            >
              {u ? "Unread" : "All"}
            </button>
          ))}
        </div>

        <QueryState query={list} empty={rows.length === 0} emptyMessage={unreadOnly ? "You're all caught up." : "No notifications yet."}>
          <ul className="divide-y">
            {rows.map((n) => {
              const read = isRead(n);
              return (
                <li key={n.id} className={cn("flex gap-3 p-4", !read && "bg-primary/5")}>
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", read ? "bg-transparent" : "bg-primary")} />
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => open(n)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn("text-sm", !read && "font-semibold")}>{n.title ?? "Notification"}</p>
                      {n.type && <EnumBadge value={n.type} />}
                    </div>
                    {(n.message ?? n.body) && <p className="mt-0.5 text-sm text-muted-foreground">{n.message ?? n.body}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{fmtDateTime(n.createdAt)}</p>
                  </button>
                  {!read && (
                    <Button variant="ghost" size="sm" disabled={markRead.isPending} onClick={() => markRead.mutate(n.id)}>
                      Mark read
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </QueryState>
        <Pagination meta={list.data?.meta} onPage={setPage} />
      </div>
    </div>
  );
}
