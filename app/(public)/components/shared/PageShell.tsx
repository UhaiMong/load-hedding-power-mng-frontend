/** Simple layout for static public pages. */
export function PageShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 text-sm leading-relaxed sm:px-6">{children}</div>
    </main>
  );
}
