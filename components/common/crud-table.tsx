"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ConfirmButton } from "@/components/common/confirm-button";
import { Pagination } from "@/components/common/pagination";
import { QueryState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { useDebounce } from "@/lib/use-debounce";
import { useOptions } from "@/lib/use-options";

type Option = { value: string; label: string };

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: Option[];
  optionsFrom?: string; // list endpoint for a select, e.g. "zones"
  required?: boolean;
  full?: boolean; // span both columns
  only?: "create" | "edit";
}

export interface FilterDef {
  name: string;
  label: string;
  options?: Option[];
  optionsFrom?: string;
}

export interface CrudConfig<T extends { id: string }> {
  path: string;
  singular: string;
  searchable?: boolean;
  filters?: FilterDef[];
  sorts: Option[];
  columns: { label: string; cell: (row: T) => React.ReactNode }[];
  fields: FieldDef[];
  defaults?: Record<string, string>;
  canCreate?: boolean;
  canEdit?: (row: T) => boolean;
  canDelete?: (row: T) => boolean;
  rowActions?: (row: T) => React.ReactNode;
}

/** Searchable, filterable, paginated table with create / edit / delete dialogs. */
export function CrudTable<T extends { id: string }>({ config }: { config: CrudConfig<T> }) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState(config.sorts[0]?.value ?? "");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const search = useDebounce(q);

  const list = useApi<T[]>(config.path, {
    page,
    limit: 10,
    q: config.searchable ? search : undefined,
    sortBy,
    order,
    ...filters,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`${config.path}/${id}`),
    meta: { success: `${config.singular} deleted`, invalidates: [[config.path]] },
  });

  const reset = <V,>(set: (v: V) => void) => (v: V) => {
    set(v);
    setPage(1);
  };
  const rows = list.data?.data ?? [];
  const hasActions = !!(config.canEdit || config.canDelete || config.rowActions);

  return (
    <div className="rounded-lg bg-background ring-1 ring-foreground/10">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        {config.searchable && (
          <div className="relative w-full sm:w-56">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search…" value={q} onChange={(e) => reset(setQ)(e.target.value)} />
          </div>
        )}
        {config.filters?.map((f) => (
          <FilterSelect
            key={f.name}
            filter={f}
            value={filters[f.name] ?? ""}
            onChange={(v) => reset(setFilters)({ ...filters, [f.name]: v })}
          />
        ))}
        <Select className="w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={config.sorts} />
        <Select
          className="w-auto"
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          options={[
            { value: "asc", label: "Asc" },
            { value: "desc", label: "Desc" },
          ]}
        />
        {config.canCreate && (
          <Button size="lg" className="ml-auto" onClick={() => setEditing("new")}>
            <Plus /> Add {config.singular.toLowerCase()}
          </Button>
        )}
      </div>

      <QueryState query={list} empty={rows.length === 0} emptyMessage={`No ${config.singular.toLowerCase()}s found.`}>
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((c) => (
                <TableHead key={c.label}>{c.label}</TableHead>
              ))}
              {hasActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {config.columns.map((c) => (
                  <TableCell key={c.label}>{c.cell(row)}</TableCell>
                ))}
                {hasActions && (
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {config.rowActions?.(row)}
                      {config.canEdit?.(row) && (
                        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setEditing(row)}>
                          <Pencil />
                        </Button>
                      )}
                      {config.canDelete?.(row) && (
                        <ConfirmButton
                          variant="ghost"
                          size="icon"
                          aria-label="Delete"
                          title={`Delete this ${config.singular.toLowerCase()}?`}
                          description="It will be removed from the list (soft delete)."
                          confirmLabel="Delete"
                          pending={remove.isPending}
                          onConfirm={() => remove.mutateAsync(row.id)}
                        >
                          <Trash2 className="text-destructive" />
                        </ConfirmButton>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </QueryState>
      <Pagination meta={list.data?.meta} onPage={setPage} />

      {editing && (
        <CrudForm config={config} row={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function FilterSelect({ filter, value, onChange }: { filter: FilterDef; value: string; onChange: (v: string) => void }) {
  const remote = useOptions(filter.optionsFrom);
  return (
    <Select
      className="w-auto max-w-48"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`All ${filter.label.toLowerCase()}`}
      options={filter.options ?? remote}
    />
  );
}

function CrudForm<T extends { id: string }>({
  config,
  row,
  onClose,
}: {
  config: CrudConfig<T>;
  row: T | null;
  onClose: () => void;
}) {
  const fields = config.fields.filter((f) => f.only !== (row ? "create" : "edit"));
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [f.name, row ? String((row as Record<string, unknown>)[f.name] ?? "") : (config.defaults?.[f.name] ?? "")]),
    ),
  );

  const save = useMutation({
    mutationFn: () => {
      const body: Record<string, unknown> = {};
      for (const f of fields) {
        const v = values[f.name]?.trim() ?? "";
        if (v !== "") body[f.name] = f.type === "number" ? Number(v) : v;
      }
      return row ? api.patch(`${config.path}/${row.id}`, body) : api.post(config.path, body);
    },
    onSuccess: onClose,
    meta: { success: `${config.singular} ${row ? "updated" : "created"}`, invalidates: [[config.path]] },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title={`${row ? "Edit" : "Add"} ${config.singular.toLowerCase()}`}>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        {fields.map((f) => (
          <FormField key={f.name} label={f.label} error={save.error?.fieldError(f.name)} className={f.full ? "sm:col-span-2" : ""}>
            <FieldControl field={f} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
          </FormField>
        ))}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function FieldControl({ field: f, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  const remote = useOptions(f.optionsFrom);
  const common = { value, required: f.required, onChange: (e: { target: { value: string } }) => onChange(e.target.value) };
  if (f.type === "select") return <Select {...common} placeholder="Select…" options={f.options ?? remote} />;
  if (f.type === "textarea") return <Textarea {...common} />;
  return <Input {...common} type={f.type === "number" ? "number" : "text"} step="any" min={f.type === "number" ? 0 : undefined} />;
}
