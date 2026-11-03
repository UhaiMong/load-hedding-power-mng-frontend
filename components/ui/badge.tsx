import { cn } from "@/lib/utils";

const tones = {
  gray: "bg-muted text-muted-foreground",
  green: "bg-green-500/15 text-green-700 dark:text-green-400",
  red: "bg-red-500/15 text-red-700 dark:text-red-400",
  yellow: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  blue: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  purple: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
};
export type Tone = keyof typeof tones;

export function Badge({
  tone = "gray",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Badge for backend enum values, e.g. "IN_PROGRESS" → "In progress". */
export function EnumBadge({ value, tones: map }: { value: string; tones?: Record<string, Tone> }) {
  const label = value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
  return <Badge tone={map?.[value] ?? "gray"}>{label}</Badge>;
}
