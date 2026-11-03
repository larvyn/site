import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getPosts, postUrl } from '../lib/blog';

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

// /rss.xml exists once a post is published, like /blog/.
export async function getStaticPaths() {
  return (await getPosts()).some((p) => !p.data.draft) ? [{ params: { feed: 'rss' } }] : [];
}

// RSS 2.0 feed of the published posts (drafts are left out of builds by getPosts).
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://larvyn.dev');
  const posts = await getPosts();
  const items = await Promise.all(
    posts
      .filter((p) => !p.data.draft)
      .map(async (p) => {
        const url = new URL(postUrl(p), base).href;
        const img = await getImage({ src: p.data.cover, width: 1200, height: 630, format: 'jpeg', quality: 85 });
        return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.data.description)}</description>
      <pubDate>${p.data.pubDate.toUTCString()}</pubDate>
      <author>noreply@larvyn.dev (${esc(p.data.author)})</author>
${p.data.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
      <enclosure url="${new URL(img.src, base).href}" type="image/jpeg" length="0" />
    </item>`;
      }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Larvyn blog</title>
    <link>${new URL('/blog/', base).href}</link>
    <atom:link href="${new URL('/rss.xml', base).href}" rel="self" type="application/rss+xml" />
    <description>Release notes, integrations and Laravel workflow guides from the team building Larvyn.</description>
    <language>en</language>
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
