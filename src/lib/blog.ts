import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// Drafts show in development, or in a preview build made with SHOW_DRAFTS=true.
const showDrafts = import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === 'true';

/** Posts newest first. A normal build never publishes a draft. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Reading time at ~230 words a minute, code blocks included. */
export function readingTime(body = ''): number {
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export const postUrl = (post: Post) => `/blog/${post.id}/`;

export const formatDate = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
