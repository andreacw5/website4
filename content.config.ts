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
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        current: z.boolean().optional(),
        github: z.string().optional(),
        website: z.string().optional(),
        preview: z.string().optional(),
        client: z.object({
          name: z.string(),
          bio: z.string().optional(),
          website: z.string().optional(),
          logo: z.string().optional(),
          instagram: z.string().optional(),
          linkedin: z.string().optional(),
        }).optional(),
        technical: z.object({
          main: z.object({
            icon: z.string(),
            name: z.string(),
            color: z.string(),
          }).optional(),
          technologies: z.array(z.object({
            icon: z.string(),
            title: z.string(),
          })).optional(),
        }).optional(),
        features: z.array(z.object({
          title: z.string(),
          subtitle: z.string(),
          icon: z.string(),
        })).optional(),
        images: z.array(z.object({
          image: z.string(),
          title: z.string(),
        })).optional(),
      }),
    }),
  },
});

