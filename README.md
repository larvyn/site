# Larvyn site

Landing page for [Larvyn](https://github.com/larvyn/larvyn), built with Astro.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve dist/
```

## Structure

- `src/pages/index.astro`: the home page (hero, tour, feature sections, palette demo, FAQ).
- `src/components/SiteHeader.astro`, `SiteFooter.astro`: the nav and footer every page shares.
- `src/pages/blog/`: the blog listing and post pages; `src/pages/rss.xml.ts` and `sitemap.xml.ts` build the feed and the sitemap.
- `src/styles/global.css`: design tokens shared with the app (dark theme, Laravel red).
- `src/components/Screen.astro`: a screenshot frame; images are optimized to WebP at build time.
- `src/components/Icon.astro`: Lucide icons, inlined as SVG.
- `src/assets/screens/`: real Larvyn screenshots of a sample store app (Acme Store).
- `public/og.png`: social preview image.

The download buttons go to the `#install` section, which shows the `curl` / `irm` install command for each OS and opens the visitor's OS tab. The version in the beta pill is read from the newest release of `larvyn/releases` at build time, so rebuild the site after each release.

## Blog

Posts are Markdown files in `src/content/blog/`; the file name is the URL (`flock-integration.md` → `/blog/flock-integration/`). The frontmatter is checked by `src/content.config.ts`:

```yaml
title: 'Up to 70 characters'
description: 'Between 70 and 170 characters: it is the search result snippet.'
pubDate: 2026-11-03
tags: ['Integrations']
cover: ../../assets/blog/<post>/cover.png   # 1200x630, also the social preview
coverAlt: 'What the cover shows'
draft: true
```

- Images go in `src/assets/blog/<post>/` and are referenced relatively (`![alt](../../assets/blog/<post>/shot.png)`); they are turned into WebP at build time. An image alone in its paragraph is shown as a framed figure; an italic line right after it is its caption.
- `draft: true` posts only show in `npm run dev`, or in a preview build (`SHOW_DRAFTS=true npm run build`). A normal build leaves them out of the pages, the feed and the sitemap. Set `draft: false` to publish.
- The Blog link in the nav and footer appears once a post is published.
- Every page gets a canonical URL, Open Graph and Twitter tags; posts also get `BlogPosting` and breadcrumb structured data.
