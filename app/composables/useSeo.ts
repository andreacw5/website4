export type PageType = 'website' | 'article' | 'profile'

export interface SeoMeta {
  title?: string
  description?: string
  keywords?: string
  robots?: string
  ogTitle?: string
  ogDescription?: string
  ogUrl?: string
  ogImage?: string
  ogImageAlt?: string
  ogImageWidth?: number
  ogImageHeight?: number
  twitterTitle?: string
  twitterDescription?: string
  /** Path relativo (es. '/builds'). Se omesso viene rilevato automaticamente da useRoute(). */
  canonical?: string
  pageType?: PageType
  /** ISO 8601, usato quando pageType === 'article' */
  articlePublishedTime?: string
  /** ISO 8601, usato quando pageType === 'article' */
  articleModifiedTime?: string
  articleAuthor?: string
  /** Disabilita i tag hreflang (utile per pagine noindex) */
  noHreflang?: boolean
  /** Disabilita l'iniezione di JSON-LD */
  noSchema?: boolean
  /** BreadcrumbList per JSON-LD strutturato. Es. [{ name: 'Build', url: '/builds' }] */
  breadcrumb?: Array<{ name: string; url: string }>
}

const seoConfig = {
  siteName: 'Andrea Tombolato',
  siteUrl: 'https://heyatom.dev',
  defaultImage: '/social_embedding.jpg',
  defaultImageWidth: 1200,
  defaultImageHeight: 630,
  titleTemplate: '%s | Andrea Tombolato',
  defaultKeywords: 'web developer, portfolio, projects, blog, Andrea Tombolato, heyatom.dev, HeyAtom',
  defaultRobots: 'index, follow',
  twitterHandle: '@andreacw96',
} as const

/** Converte un path relativo in URL assoluto */
const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${seoConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/** Rimuove il prefisso di locale dal path (es. /en/builds → /builds) */
const stripLocalePrefix = (path: string): string =>
  path.replace(/^\/(en|it)(?=\/|$)/, '') || '/'

/**
 * Composable SEO.
 * Accetta sia un oggetto statico `SeoMeta` che una factory function `() => SeoMeta`
 * per supportare pagine dinamiche con dati reattivi (es. builds/[slug].vue).
 */
export const useSeo = (metaOrFactory: SeoMeta | (() => SeoMeta) = {}) => {
  const { t, locale } = useI18n()
  const route = useRoute()

  // Normalizza a computed: se è una funzione viene ri-eseguita reattivamente
  const meta = computed<SeoMeta>(() =>
    typeof metaOrFactory === 'function' ? metaOrFactory() : metaOrFactory
  )

  // ── Computed values (reattivi a locale) ──────────────────────────
  const title = computed(() =>
    meta.value.title || t('common.defaultTitle', 'Kaish-DbD')
  )
  const description = computed(() =>
    meta.value.description || t('common.defaultDescription', 'The ultimate Dead by Daylight community for builds, perks, and strategies.')
  )
  const imageAbsoluteUrl = computed(() =>
    toAbsoluteUrl(meta.value.ogImage || seoConfig.defaultImage)
  )
  const robots = computed(() =>
    meta.value.robots || seoConfig.defaultRobots
  )
  const ogLocale = computed(() => locale.value === 'it' ? 'it_IT' : 'en_US')
  const ogLocaleAlternate = computed(() => locale.value === 'it' ? 'en_US' : 'it_IT')

  // Canonical: usa il path fornito, altrimenti lo rileva dalla route
  const cleanPath = computed(() => meta.value.canonical ?? stripLocalePrefix(route.path))
  const canonicalUrl = computed(() => `${seoConfig.siteUrl}${cleanPath.value}`)

  // ── hreflang ─────────────────────────────────────────────────────────────────
  const hreflangLinks = computed(() => {
    if (meta.value.noHreflang || (meta.value.robots && meta.value.robots.includes('noindex'))) return []
    const p = cleanPath.value
    const enPath = p === '/' ? '/en' : `/en${p}`
    return [
      { key: 'hreflang-it', rel: 'alternate', hreflang: 'it', href: `${seoConfig.siteUrl}${p}` },
      { key: 'hreflang-en', rel: 'alternate', hreflang: 'en', href: `${seoConfig.siteUrl}${enPath}` },
      { key: 'hreflang-x-default', rel: 'alternate', hreflang: 'x-default', href: `${seoConfig.siteUrl}${p}` },
    ]
  })

  // ── JSON-LD structured data ───────────────────────────────────────────────────
  const schemaScripts = computed(() => {
    if (meta.value.noSchema) return []

    const schemas: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${seoConfig.siteUrl}/builds?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ]

    if (meta.value.pageType === 'article') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title.value,
        description: description.value,
        image: imageAbsoluteUrl.value,
        url: canonicalUrl.value,
        ...(meta.value.articlePublishedTime && { datePublished: meta.value.articlePublishedTime }),
        ...(meta.value.articleModifiedTime && { dateModified: meta.value.articleModifiedTime }),
        ...(meta.value.articleAuthor && { author: { '@type': 'Person', name: meta.value.articleAuthor } }),
        publisher: { '@type': 'Organization', name: seoConfig.siteName, url: seoConfig.siteUrl },
      })
    }

    // BreadcrumbList
    if (meta.value.breadcrumb && meta.value.breadcrumb.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: seoConfig.siteName, item: seoConfig.siteUrl },
          ...meta.value.breadcrumb.map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: crumb.name,
            item: toAbsoluteUrl(crumb.url),
          })),
        ],
      })
    }

    return schemas.map((schema, i) => ({
      key: `schema-org-${i}`,
      type: 'application/ld+json',
      children: JSON.stringify(schema),
    }))
  })

  // ── useHead ───────────────────────────────────────────────────────────────────
  useHead({
    title,
    titleTemplate: seoConfig.titleTemplate,
    meta: computed(() => [
      // Basic
      { key: 'description', name: 'description', content: description.value },
      { key: 'keywords', name: 'keywords', content: meta.value.keywords || seoConfig.defaultKeywords },
      { key: 'robots', name: 'robots', content: robots.value },

      // Open Graph
      { key: 'og:type', property: 'og:type', content: meta.value.pageType || 'website' },
      { key: 'og:site_name', property: 'og:site_name', content: seoConfig.siteName },
      { key: 'og:title', property: 'og:title', content: meta.value.ogTitle || title.value },
      { key: 'og:description', property: 'og:description', content: meta.value.ogDescription || description.value },
      { key: 'og:url', property: 'og:url', content: meta.value.ogUrl || canonicalUrl.value },
      { key: 'og:image', property: 'og:image', content: imageAbsoluteUrl.value },
      { key: 'og:image:secure_url', property: 'og:image:secure_url', content: imageAbsoluteUrl.value },
      { key: 'og:image:width', property: 'og:image:width', content: String(meta.value.ogImageWidth ?? seoConfig.defaultImageWidth) },
      { key: 'og:image:height', property: 'og:image:height', content: String(meta.value.ogImageHeight ?? seoConfig.defaultImageHeight) },
      { key: 'og:image:alt', property: 'og:image:alt', content: meta.value.ogImageAlt || title.value },
      { key: 'og:locale', property: 'og:locale', content: ogLocale.value },
      { key: 'og:locale:alternate', property: 'og:locale:alternate', content: ogLocaleAlternate.value },

      // Article-specific (ignorati se pageType !== 'article')
      ...(meta.value.pageType === 'article' && meta.value.articlePublishedTime
        ? [{ key: 'article:published_time', property: 'article:published_time', content: meta.value.articlePublishedTime }]
        : []),
      ...(meta.value.pageType === 'article' && meta.value.articleModifiedTime
        ? [{ key: 'article:modified_time', property: 'article:modified_time', content: meta.value.articleModifiedTime }]
        : []),
      ...(meta.value.pageType === 'article' && meta.value.articleAuthor
        ? [{ key: 'article:author', property: 'article:author', content: meta.value.articleAuthor }]
        : []),

      // Twitter Card
      { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { key: 'twitter:site', name: 'twitter:site', content: seoConfig.twitterHandle },
      { key: 'twitter:title', name: 'twitter:title', content: meta.value.twitterTitle || title.value },
      { key: 'twitter:description', name: 'twitter:description', content: meta.value.twitterDescription || description.value },
      { key: 'twitter:image', name: 'twitter:image', content: imageAbsoluteUrl.value },
      { key: 'twitter:image:alt', name: 'twitter:image:alt', content: meta.value.ogImageAlt || title.value },
    ]),
    link: computed(() => [
      { key: 'canonical', rel: 'canonical', href: canonicalUrl.value },
      ...hreflangLinks.value,
    ]),
    script: schemaScripts,
  })
}

export default useSeo
