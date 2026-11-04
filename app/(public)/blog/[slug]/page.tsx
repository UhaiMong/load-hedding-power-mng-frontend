import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Loading } from "@/components/common/states";
import { getPost, getPosts, postDate } from "@/lib/blog";
import { Markdown } from "./markdown";

type Props = { params: Promise<{ slug: string }> };

// Prerender known posts; new slugs render on demand.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "placeholder" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

async function PostContent({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="min-w-0">
      <header className="mb-8 border-b pb-6">
        <p className="text-xs text-muted-foreground">
          {[postDate(post), post.author?.name, post.readTime].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight wrap-break-word sm:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-muted-foreground">{post.excerpt}</p>}
        {!!post.tags?.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{t}</span>
            ))}
          </div>
        )}
      </header>
      <Markdown>{post.content ?? ""}</Markdown>
    </article>
  );
}

export default function BlogDetailsPage({ params }: Props) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to blog
      </Link>
      <Suspense fallback={<Loading />}>
        <PostContent params={params} />
      </Suspense>
    </main>
  );
}
