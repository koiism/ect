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

const getCitiesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({config})
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'cities',
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

    const sitemap: ISitemapField[] = results.docs
      ? results.docs
          .filter((city) => Boolean(city?.slug))
          .map((city) => ({
            loc: `${SITE_URL}/cities/${city?.slug}`,
            lastmod: city.updatedAt || dateFallback,
            priority: 0.8,
            changefreq: 'weekly' as Changefreq
          }))
      : []

    return sitemap
  },
  ['cities-sitemap'],
  {
    tags: ['cities-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getCitiesSitemap()

  return getServerSideSitemap(sitemap)
}
