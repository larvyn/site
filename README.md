# Larvyn site

Landing page for [Larvyn](https://github.com/larvyn/larvyn), built with Astro.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve dist/
```

## Structure

- `src/pages/index.astro`: the whole page (hero, tour, feature sections, palette demo, FAQ).
- `src/styles/global.css`: design tokens shared with the app (dark theme, Laravel red).
- `src/components/Screen.astro`: a screenshot frame; images are optimized to WebP at build time.
- `src/components/Icon.astro`: Lucide icons, inlined as SVG.
- `src/assets/screens/`: real Larvyn screenshots of a sample store app (Acme Store).
- `public/og.png`: social preview image.

The download buttons go to the `#install` section, which shows the `curl` / `irm` install command for each OS and opens the visitor's OS tab. The version in the beta pill is read from the newest release of `larvyn/releases` at build time, so rebuild the site after each release.
