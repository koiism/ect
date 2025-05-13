import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { unstable_cache } from 'next/cache'

type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

interface ISitemapField {
  loc: string
  lastmod?: string
  changefreq?: Changefreq
  priority?: number
}

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'pages',
      draft: false,
      depth: 0,
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const defaultSitemap: ISitemapField[] = [
      {
        loc: `${SITE_URL}search`,
        lastmod: dateFallback,
        priority: 0.8,
        changefreq: 'daily' as Changefreq,
      },
    ]

    const sitemap: ISitemapField[] = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            const isHomePage = page?.slug === 'home'
            return {
              loc: isHomePage ? `${SITE_URL}` : `${SITE_URL}${page?.slug}`,
              lastmod: page.updatedAt || dateFallback,
              priority: isHomePage ? 1.0 : 0.7,
              changefreq: isHomePage ? 'daily' : ('weekly' as Changefreq),
            }
          })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
