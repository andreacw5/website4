import { defineCollection, defineContentConfig, z } from '@nuxt/content';

// Campo localizzato: stringa semplice oppure oggetto { it, en }
const localeField = z.union([
  z.string(),
  z.object({
    it: z.string().optional(),
    en: z.string().optional(),
  }),
]).optional();

const localeFieldRequired = z.union([
  z.string(),
  z.object({
    it: z.string().optional(),
    en: z.string().optional(),
  }),
]);

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        title: z.string().optional(),
        description: localeField,
      }),
    }),
    travels: defineCollection({
      type: 'page',
      source: 'travels/countries/**/*.md',
      schema: z.object({
        name: z.string(),
        flag: z.string(),
        year: z.number(),
        continent: z.string(),
        visited: z.boolean(),
        highlight: z.boolean(),
      }),
    }),
    travelsPhotos: defineCollection({
      type: 'page',
      source: 'travels/photos/**/*.md',
      schema: z.object({
        id: z.string(),
        location: z.string(),
        country: z.string().optional(),
        countrySlug: z.string(),
        year: z.number(),
        category: z.string(),
        aspect: z.string().optional(),
        src: z.string(),
        alt: z.string(),
        featured: z.boolean().optional(),
      }),
    }),
    volunteeringProjects: defineCollection({
      type: 'page',
      source: 'volunteering/**/*.md',
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        tag: z.string(),
        link: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        github: z.string().optional(),
        order: z.number().optional(),
      }),
    }),
    uses: defineCollection({
      type: 'data',
      source: 'uses/**/*.json',
      schema: z.object({
        icon: z.string(),
        titleKey: z.string(),
        column: z.string(),
        order: z.number(),
        items: z.array(z.object({
          emoji: z.string().optional(),
          icon: z.string().optional(),
          name: z.string(),
          badge: z.object({
            text: z.union([z.string(), z.object({ it: z.string().optional(), en: z.string().optional() })]),
            type: z.string(),
          }).optional(),
          desc: localeFieldRequired,
        })),
      }),
    }),
    experience: defineCollection({
      type: 'data',
      source: 'experience/**/*.json',
      schema: z.object({
        key: z.string(),
        order: z.number(),
        from: z.string(),
        to: z.string().optional(),
        type: z.enum(['work', 'community', 'volunteer']),
        website: z.string(),
        icon: z.string().optional(),
        svgIcon: z.string().optional(),
        role: localeFieldRequired,
        company: localeFieldRequired,
        description: localeFieldRequired,
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        title: localeFieldRequired,
        description: localeField,
        startDate: z.string().optional(),
        current: z.boolean().optional(),
        featured: z.boolean().optional(),
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
          title: localeFieldRequired,
          subtitle: localeFieldRequired,
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
