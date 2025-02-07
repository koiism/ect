import { ProductSearch } from '@/payload-types'
import { LoadMoreProducts } from '@/components/products/LoadMoreProducts'

interface SearchResultsProps {
  query: string
  results: {
    products: ProductSearch[]
    hasMoreProducts: boolean
    totalProducts: number
  }
  page: number
  limit: number
}

export function SearchResults({ query, results, page, limit }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center text-muted-foreground">
        Please enter a search keyword.
      </div>
    )
  }

  if (results.totalProducts === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No related results found.
      </div>
    )
  }

  return (
    <div>
      <LoadMoreProducts
        initialProducts={results.products}
        initHasMore={results.hasMoreProducts}
        mode="auto"
        enableLoadMore="auto"
        loadMoreLimit={limit}
      />
    </div>
  )
}
