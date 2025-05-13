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

const getProductsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({config})
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'products',
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
          .filter((product) => Boolean(product?.slug))
          .map((product) => ({
            loc: `${SITE_URL}products/${product?.slug}`,
            lastmod: product.updatedAt || dateFallback,
            priority: 0.9,
            changefreq: 'daily' as Changefreq
          }))
      : []

    return sitemap
  },
  ['products-sitemap'],
  {
    tags: ['products-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getProductsSitemap()

  return getServerSideSitemap(sitemap)
}
