import type { APIRoute } from 'astro';
import { getPosts, postUrl } from '../lib/blog';

// Every public page: the home page, the blog and each published post.
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://larvyn.dev');
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const urls = [
    { loc: '/', lastmod: undefined as string | undefined },
    ...(posts.length ? [{ loc: '/blog/', lastmod: day(posts[0].data.updatedDate ?? posts[0].data.pubDate) }] : []),
    ...posts.map((p) => ({ loc: postUrl(p), lastmod: day(p.data.updatedDate ?? p.data.pubDate) })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u.loc, base).href}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
