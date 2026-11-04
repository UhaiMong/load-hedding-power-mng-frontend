import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Post = {
  slug: string;
  title: string;
  createdAt: string;
  content: string;
};

const POSTS_URL = "https://gen-endpoint.com/api/posts";

async function getPosts(): Promise<Post[]> {
  try {
    if (!POSTS_URL) throw new Error("BLOG_POSTS_URL is not configured");

    const response = await fetch(POSTS_URL, { next: { revalidate: 300 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts (${response.status})`);
    }

    const data = await response.json();
    const posts = Array.isArray(data) ? data : data.posts;
    if (!Array.isArray(posts)) throw new Error("Invalid blog posts response");
    return posts;
  } catch (error) {
    console.error("Unable to load blog posts:", error);
    return [];
  }
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) notFound();

  const publishedDate = new Date(post.createdAt);
  const dateLabel = Number.isNaN(publishedDate.getTime())
    ? post.createdAt
    : new Intl.DateTimeFormat("en", {
        dateStyle: "long",
      }).format(publishedDate);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <article>
        <header className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-3 text-sm text-gray-500">{dateLabel}</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-blue-700 prose-img:rounded-lg">
          <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
