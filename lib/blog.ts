import { cacheLife } from "next/cache";

// Free mock blog API: https://gen-endpoint.com/apis/blog-api
const BLOG_API = "https://gen-endpoint.com/api/posts";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  categoryId?: string;
  author?: { name?: string };
  readTime?: string;
  publishedAt?: string;
  createdAt?: string;
};

export async function getPosts(limit = 12): Promise<Post[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${BLOG_API}?limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    const posts = Array.isArray(data) ? data : data?.posts;
    return Array.isArray(posts) ? posts.filter((p: Post) => p?.slug) : [];
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${BLOG_API}/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const post = data?.post ?? data?.data ?? data;
    return post?.slug ? (post as Post) : null;
  } catch {
    return null;
  }
}

export function postDate(p: Post) {
  const raw = p.publishedAt ?? p.createdAt;
  const d = raw ? new Date(raw) : null;
  return d && !Number.isNaN(d.getTime())
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d)
    : "";
}
