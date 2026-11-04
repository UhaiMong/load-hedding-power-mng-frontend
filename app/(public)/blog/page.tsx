import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../components/shared/PageShell";
import { companyName } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { getPosts, postDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: `Explore our ${companyName} Insights and practical solutions`,
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <PageShell title="Blog" subtitle="Tips and updates from our team.">
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts available right now. Please check back later.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.id ?? p.slug} className="flex min-w-0 flex-col rounded-lg p-5 ring-1 ring-foreground/10">
              <p className="text-xs text-muted-foreground">
                {[postDate(p), p.categoryId].filter(Boolean).join(" · ")}
              </p>
              <h2 className="mt-1 line-clamp-2 font-semibold wrap-break-word">{p.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-muted-foreground">{p.excerpt}</p>
              <Link href={`/blog/${p.slug}`} className={buttonVariants({ className: "mt-4 w-full sm:w-fit" })}>
                Read Details
              </Link>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
