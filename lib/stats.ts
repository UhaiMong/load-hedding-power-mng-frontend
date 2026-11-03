// Turns an analytics/stats response of unknown shape into tiles, bar groups and tables.

export type Tile = { label: string; value: number; key: string };
export type Bars = { title: string; data: { name: string; value: number }[] };
export type RowTable = { title: string; labelKey: string; metrics: string[]; rows: Record<string, unknown>[] };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** "avgRestorationMinutes" → "Avg restoration minutes", "IN_PROGRESS" → "In progress" */
export function humanizeKey(k: string) {
  const s = k.includes("_") || k === k.toUpperCase() ? k.toLowerCase().replace(/_/g, " ") : k.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatStat(key: string, v: number) {
  const k = key.toLowerCase();
  if (/amount|revenue|collected/.test(k)) return `৳${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (/percent|rate|ratio|uptime/.test(k)) return `${(v <= 1 && !/percent/.test(k) ? v * 100 : v).toFixed(1)}%`;
  if (/minutes/.test(k)) return `${Math.round(v).toLocaleString()} min`;
  if (/hours/.test(k)) return `${v.toFixed(1)} h`;
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/** Display label of a row: name-like string, or a nested { name }. */
export function rowLabel(row: Obj, labelKey: string) {
  const v = row[labelKey];
  if (typeof v === "string") return v;
  if (isObj(v) && typeof v.name === "string") return v.name;
  return String(v ?? "—");
}

function labelKeyOf(row: Obj) {
  const keys = Object.keys(row);
  const pref = ["name", "label", "status", "severity", "type", "month", "date", "areaName", "technicianName", "area", "technician", "feeder", "zone"];
  return (
    pref.find((k) => k in row && (typeof row[k] === "string" || (isObj(row[k]) && typeof (row[k] as Obj).name === "string"))) ??
    keys.find((k) => typeof row[k] === "string" && k !== "id" && !k.endsWith("Id")) ??
    keys[0]
  );
}

function asTable(title: string, arr: unknown[]): RowTable | null {
  const rows = arr.filter(isObj);
  if (!rows.length) return null;
  const labelKey = labelKeyOf(rows[0]);
  const metrics = Object.keys(rows[0]).filter((k) => isNum(rows[0][k]) && k !== labelKey);
  return metrics.length ? { title, labelKey, metrics, rows } : null;
}

export function parseStats(data: unknown) {
  const tiles: Tile[] = [];
  const bars: Bars[] = [];
  const tables: RowTable[] = [];

  const walk = (obj: Obj, prefix: string) => {
    for (const [k, v] of Object.entries(obj)) {
      const title = prefix ? `${prefix} · ${humanizeKey(k)}` : humanizeKey(k);
      if (isNum(v)) tiles.push({ key: k, label: title, value: v });
      else if (Array.isArray(v)) {
        const t = asTable(title, v);
        if (!t) continue;
        // two-column arrays ({status, count}) read best as a bar chart
        if (t.metrics.length === 1) bars.push({ title, data: t.rows.map((r) => ({ name: humanizeKey(rowLabel(r, t.labelKey)), value: r[t.metrics[0]] as number })) });
        else tables.push(t);
      } else if (isObj(v)) {
        const entries = Object.entries(v);
        // { REPORTED: 3, RESTORED: 9 } → bars; mixed objects → nested tiles
        if (entries.length && entries.every(([ek, ev]) => isNum(ev) && ek === ek.toUpperCase()))
          bars.push({ title, data: entries.map(([name, value]) => ({ name: humanizeKey(name), value: value as number })) });
        else walk(v, title);
      }
    }
  };

  if (Array.isArray(data)) {
    const t = asTable("Results", data);
    if (t) tables.push(t);
  } else if (isObj(data)) walk(data, "");
  return { tiles, bars, tables };
}
