import ReactMarkdown, { type Components } from "react-markdown";

// Hand-styled markdown (no typography plugin); wide blocks scroll inside, page never overflows.
const components: Components = {
  h1: (p) => <h2 className="mt-10 mb-4 text-2xl font-bold sm:text-3xl" {...p} />,
  h2: (p) => <h2 className="mt-10 mb-4 text-xl font-semibold sm:text-2xl" {...p} />,
  h3: (p) => <h3 className="mt-8 mb-3 text-lg font-semibold sm:text-xl" {...p} />,
  h4: (p) => <h4 className="mt-6 mb-2 font-semibold" {...p} />,
  p: (p) => <p className="my-4 leading-7" {...p} />,
  a: (p) => <a className="text-primary underline underline-offset-2 break-all" target="_blank" rel="noreferrer" {...p} />,
  ul: (p) => <ul className="my-4 list-disc space-y-2 pl-6" {...p} />,
  ol: (p) => <ol className="my-4 list-decimal space-y-2 pl-6" {...p} />,
  li: (p) => <li className="leading-7" {...p} />,
  blockquote: (p) => <blockquote className="my-6 border-l-4 pl-4 italic text-muted-foreground" {...p} />,
  hr: () => <hr className="my-8" />,
  img: ({ alt, ...p }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} className="my-6 h-auto max-w-full rounded-lg" {...p} />
  ),
  pre: (p) => <pre className="my-6 max-w-full overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-6 sm:text-sm" {...p} />,
  code: ({ className, ...p }) =>
    className ? (
      <code className={`${className} font-mono`} {...p} />
    ) : (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] break-words" {...p} />
    ),
  table: (p) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p) => <th className="border px-3 py-2 text-left font-semibold" {...p} />,
  td: (p) => <td className="border px-3 py-2 align-top" {...p} />,
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="min-w-0 text-base wrap-break-word">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
