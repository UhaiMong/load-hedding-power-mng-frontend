import { cn } from "@/lib/utils";

const control =
  "w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive disabled:opacity-60";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(control, "h-9", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea rows={3} className={cn(control, "py-2", className)} {...props} />;
}

/** Native select; pass `options` or your own <option> children. */
export function Select({
  className,
  options,
  placeholder,
  children,
  ...props
}: React.ComponentProps<"select"> & {
  options?: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select className={cn(control, "h-9 pr-8", className)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options?.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      {children}
    </select>
  );
}

/** Label + control + error text. */
export function FormField({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}
