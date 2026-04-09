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
    travels: defineCollection({
      type: 'page',
      source: 'travels/**/*.md',
      schema: z.object({
        title: z.string(),
        short: z.string().optional(),
        cover: z.string().optional(),
        category: z.string().optional(),
        created_at: z.string().optional(),
        gallery: z.array(z.object({
          image: z.string(),
          alt: z.string().optional(),
          cols: z.number().optional(),
        })).optional(),
      }),
    }),
    starships: defineCollection({
      type: 'data',
      source: 'utilities/star-citizen/**/*.json',
      schema: z.object({
        customName: z.string().nullable().optional(),
        flagship: z.boolean().optional(),
        name: z.string(),
        slug: z.string(),
        manufacturer: z.string(),
        manufacturerCode: z.string(),
        classification: z.string(),
        focus: z.string(),
        description: z.string().optional(),
        inGame: z.boolean(),
        productionStatus: z.string(),
        pledgePrice: z.number().nullable().optional(),
        size: z.string().nullable().optional(),
        length: z.number().nullable().optional(),
        beam: z.number().nullable().optional(),
        height: z.number().nullable().optional(),
        cargo: z.number().nullable().optional(),
        crewMin: z.number().nullable().optional(),
        crewMax: z.number().nullable().optional(),
        scmSpeed: z.number().nullable().optional(),
        storeUrl: z.string().nullable().optional(),
        image: z.string().nullable().optional(),
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

