import { Metadata } from 'next'
import { Title } from '@/components/ui/title'
import { PageClient } from './page.client'
import { SearchResults as SearchResultsComponent } from './components/SearchResults'
import { fetchSearchResults } from '@/search/fetchWithPayload'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

type Args = {
  searchParams: Promise<{
    q?: string
  }>
}

// Generate dynamic metadata
export async function generateMetadata(params: Args): Promise<Metadata> {
  const { q } = await params.searchParams
  const query = typeof q === 'string' ? q : ''

  const title = query
    ? `Search Results: ${query} | Explore China Tour`
    : 'Search | Explore China Tour'

  const description = query
    ? `View search results for "${query}" on Explore China Tour. Find tours, attractions and travel experiences in China.`
    : 'Search for tours, attractions and travel experiences in China. Find your perfect China adventure with Explore China Tour.'

  return {
    title,
    description,
    keywords: [
      'China travel search',
      'China tour search',
      'China attractions search',
      query,
    ].filter(Boolean),
    robots: {
      index: false,
      follow: true,
    },
    openGraph: mergeOpenGraph({
      title,
      description,
      type: 'website',
    }),
    alternates: {
      canonical: '/search' + (query ? `?q=${encodeURIComponent(query)}` : ''),
    },
  }
}

export default async function SearchPage({ searchParams }: Args) {
  const { q } = await searchParams
  const query = typeof q === 'string' ? q : ''
  const limit = 8

  const results = query ? await fetchSearchResults({
    type: 'products',
    page: 1,
    limit,
    query,
  }) : {
    items: [],
    hasMore: false,
    total: 0,
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6 py-16 pt-24">
        <div className="max-w-4xl mb-16">
          <PageClient />

          <Title
            title={query ? `Search Results: "${query}"` : 'Search'}
            variant="left"
            className="mb-8"
          />

          {query && (
            <p className="text-muted-foreground mb-8">
              Found {results.total} related results
            </p>
          )}
        </div>

        <SearchResultsComponent
          query={query}
          results={{
            products: results.items,
            hasMoreProducts: results.hasMore,
            totalProducts: results.total,
          }}
          page={1}
          limit={limit}
        />
      </div>
    </main>
  )
}
