import { getServerSideSitemapIndex } from 'next-sitemap'

export async function GET() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const sitemaps = [
    `${SITE_URL}/pages-sitemap.xml`,
    `${SITE_URL}/posts-sitemap.xml`,
    `${SITE_URL}/cities-sitemap.xml`,
    `${SITE_URL}/products-sitemap.xml`,
    // `${SITE_URL}/categories-sitemap.xml`
  ]

  return getServerSideSitemapIndex(sitemaps)
}
