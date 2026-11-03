import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts: src/content/blog/<slug>.md, served at /blog/<slug>/.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      // Search engines cut titles around 60 characters and descriptions around 160.
      title: z.string().max(70),
      description: z.string().min(70).max(170),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Ivan Mercedes'),
      tags: z.array(z.string()).default([]),
      // 1200x630: the post's hero and its Open Graph / Twitter image.
      cover: image(),
      coverAlt: z.string(),
      // Drafts show in `npm run dev` only: no page, feed or sitemap entry in the build.
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
