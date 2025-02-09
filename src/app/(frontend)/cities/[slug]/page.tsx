import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Metadata } from 'next'
import { CityHero } from './components/CityHero'
import { CityContent } from './components/CityContent'
import { fetchSearchResults } from '@/search/fetchWithPayload'
import { generateMeta } from '@/utilities'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Generate dynamic metadata
export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const payload = await getPayload({config})

  const { docs: [city] } = await payload.find({
    collection: 'cities',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return generateMeta({ doc: city })
}

export default async function CityPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({config})

  const { docs: cities } = await payload.find({
    collection: 'cities',
    locale: 'en',
    depth: 5,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const city = cities[0]

  if (!city) {
    return notFound()
  }

  const loadMoreLimit = 8

  // Fetch initial products for the city
  const { items: products, hasMore: hasNextPage } = await fetchSearchResults({
    type: 'products',
    where: {
      'city.title': {
        equals: city?.title,
      },
    },
    limit: loadMoreLimit,
    page: 1,
  })

  return (
    <main className="min-h-screen pb-8 sm:pb-16">
      {city.image && typeof city.image !== 'string' && city.image.url && (
        <CityHero
          title={city.title}
          imageUrl={city.image.url}
        />
      )}
      <CityContent
        title={city.title}
        city={city}
        initialProducts={products}
        hasMoreProducts={hasNextPage}
        loadMoreLimit={loadMoreLimit}
      />
    </main>
  )
}
