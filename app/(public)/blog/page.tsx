import type { Metadata } from "next";
import { PageShell } from "../components/shared/PageShell";
import { companyName } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const POSTS_URL = "https://gen-endpoint.com/api/posts";
export const metadata: Metadata = {
  title: "Blog",
  description: `Explore our ${companyName} Insights and practical solutions`,
  alternates: { canonical: "/blog" },
};

const FALLBACK_POSTS = [
  {
    title: "How load-shedding schedules are planned",
    date: "2026-10-12",
    text: "When supply falls short, feeders are rotated by priority so no area is cut for too long. Hospitals and critical loads are protected first.",
    excerpt: "",
    slug: "",
  },
];

type Post = {
  id?: string | number;
  title: string;
  slug: string;
  date?: string;
  createdAt?: string;
  text?: string;
  content?: string;
  excerpt: string;
  body?: string;
};

async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(POSTS_URL, { next: { revalidate: 300 } });
    if (!response.ok) return FALLBACK_POSTS;

    const data = await response.json();
    const posts = Array.isArray(data) ? data : data.posts;
    return Array.isArray(posts) ? posts : FALLBACK_POSTS;
  } catch {
    return FALLBACK_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <PageShell title="Blog" subtitle="Tips and updates from our team.">
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((p, index) => (
          <article
            key={p.id ?? p.title ?? index}
            className="rounded-lg p-5 ring-1 ring-foreground/10 flex flex-col justify-between"
          >
            {(p.date ?? p.createdAt) && (
              <time className="text-xs text-muted-foreground">
                {new Date(p.date ?? p.createdAt!).toLocaleDateString(
                  undefined,
                  {
                    dateStyle: "medium",
                  },
                )}
              </time>
            )}
            <div>
              <h2 className="mt-1 font-semibold">{p.title}</h2>
              <p className="mt-2 text-muted-foreground">{p.excerpt}</p>
            </div>
            <Button className={"text-white"}>
              <Link href={`/blog/${p.slug}`}>Read Details</Link>
            </Button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
