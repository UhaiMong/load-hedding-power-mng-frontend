export const fmtDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

export const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—");

export const fmtTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—";

/** ISO → value for <input type="datetime-local"> */
export function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value → ISO */
export const fromLocalInput = (v: string) => new Date(v).toISOString();

/** Today as YYYY-MM-DD in local time */
export const todayISO = () => toLocalInput(new Date().toISOString()).slice(0, 10);
