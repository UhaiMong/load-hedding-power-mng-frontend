import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export const linkClass =
  "font-medium text-primary underline-offset-4 hover:underline";

export function AuthShell({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export function Field({
  label,
  name,
  error,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
  name: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        className={cn(
          "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function Notice({
  error,
  success,
}: {
  error?: ApiError | null;
  success?: string;
}) {
  if (error) {
    return (
      <p
        role="alert"
        className="rounded-md bg-destructive/10 p-2 text-sm text-destructive"
      >
        {error.message}
      </p>
    );
  }
  if (success)
    return (
      <p className="rounded-md bg-green-500/10 p-2 text-sm text-green-700 dark:text-green-400">
        {success}
      </p>
    );
  return null;
}

export { Link };
