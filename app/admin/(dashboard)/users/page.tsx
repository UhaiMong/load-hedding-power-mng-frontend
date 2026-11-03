"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, Plus, Search, Trash2, UserCog } from "lucide-react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { ConfirmButton } from "@/components/common/confirm-button";
import { PageHeader } from "@/components/common/page-header";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { ROLE_LABEL, ROLES } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import type { User } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { useDebounce } from "@/lib/use-debounce";
import { CreateStaffDialog } from "./_components/create-staff-dialog";
import { RoleDialog } from "./_components/role-dialog";
import { UserDialog } from "./_components/user-dialog";

const roleOptions = ROLES.map((r) => ({ value: r, label: ROLE_LABEL[r] }));

type DialogState = { kind: "create" } | { kind: "view" | "role"; user: User } | null;

export default function UsersPage() {
  const { user: me } = useAuth();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [order, setOrder] = useState("asc");
  const [dialog, setDialog] = useState<DialogState>(null);
  const search = useDebounce(q);

  const list = useApi<User[]>("admin/users", { q: search, role, isActive, sortBy: "name", order, page, limit: 10 });
  const rows = list.data?.data ?? [];

  const setStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.patch(`admin/users/${id}/status`, { isActive }),
    meta: { success: "User status updated", invalidates: [["admin/users"]] },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`admin/users/${id}`),
    meta: { success: "User deleted", invalidates: [["admin/users"]] },
  });

  const filter = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    set(e.target.value);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage customers and staff accounts."
        actions={
          <Button size="lg" onClick={() => setDialog({ kind: "create" })}>
            <Plus /> Create staff
          </Button>
        }
      />

      <div className="rounded-lg bg-background ring-1 ring-foreground/10">
        <div className="flex flex-wrap items-center gap-2 border-b p-3">
          <div className="relative w-full sm:w-56">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search name or email…" value={q} onChange={filter(setQ)} />
          </div>
          <Select className="w-auto" value={role} onChange={filter(setRole)} placeholder="All roles" options={roleOptions} />
          <Select
            className="w-auto"
            value={isActive}
            onChange={filter(setIsActive)}
            placeholder="Any status"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
          />
          <Select
            className="w-auto"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            options={[
              { value: "asc", label: "Name A–Z" },
              { value: "desc", label: "Name Z–A" },
            ]}
          />
        </div>

        <QueryState query={list} empty={rows.length === 0} emptyMessage="No users found.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Zone / Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((u) => {
                const self = u.id === me?.id;
                const active = u.isActive !== false;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <p className="font-medium">{u.name} {self && <span className="text-muted-foreground">(you)</span>}</p>
                      <p className="text-muted-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell><Badge tone="blue">{ROLE_LABEL[u.role] ?? u.role}</Badge></TableCell>
                    <TableCell>{u.profile?.zone?.name ?? u.profile?.area?.name ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge tone={active ? "green" : "gray"}>{active ? "Active" : "Inactive"}</Badge>
                        {u.emailVerified === false && <Badge tone="yellow">Unverified</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{fmtDate(u.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" aria-label="View" onClick={() => setDialog({ kind: "view", user: u })}>
                          <Eye />
                        </Button>
                        {!self && (
                          <>
                            <Button variant="ghost" size="icon" aria-label="Change role" onClick={() => setDialog({ kind: "role", user: u })}>
                              <UserCog />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={setStatus.isPending}
                              onClick={() => setStatus.mutate({ id: u.id, isActive: !active })}
                            >
                              {active ? "Deactivate" : "Activate"}
                            </Button>
                            <ConfirmButton
                              variant="ghost"
                              size="icon"
                              aria-label="Delete"
                              title={`Delete ${u.name}?`}
                              description="The account is soft-deleted and signed out everywhere."
                              confirmLabel="Delete"
                              pending={remove.isPending}
                              onConfirm={() => remove.mutateAsync(u.id)}
                            >
                              <Trash2 className="text-destructive" />
                            </ConfirmButton>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </QueryState>
        <Pagination meta={list.data?.meta} onPage={setPage} />
      </div>

      {dialog?.kind === "create" && <CreateStaffDialog onClose={() => setDialog(null)} />}
      {dialog?.kind === "view" && <UserDialog id={dialog.user.id} onClose={() => setDialog(null)} />}
      {dialog?.kind === "role" && <RoleDialog user={dialog.user} onClose={() => setDialog(null)} />}
    </>
  );
}
