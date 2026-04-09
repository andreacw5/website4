import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    }),
    portfolio: defineCollection({
      type: 'page',
      source: 'portfolio/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        year: z.number().optional(),
        status: z.string().optional(),
        tech: z.array(z.string()).optional(),
        github: z.string().optional(),
        demo: z.string().optional(),
        image: z.string().optional(),
      }),
    }),
  },
});

