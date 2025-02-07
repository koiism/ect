'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'
import { Category, City, type RecommendationBlock as RecommendationBlockType, ProductSearch } from '@/payload-types'
import { LoadMoreProducts } from '@/components/products/LoadMoreProducts'
import { fetchSearchResults } from '@/search/fetchWithClient'

type Props = {
  className?: string
} & RecommendationBlockType

export const RecommendationBlock: React.FC<Props> = ({
  className,
  mode = 'auto',
  selectedProducts,
  filterType,
  city,
  category,
  limit,
  enableLoadMore = 'none',
  loadMoreLimit = 4,
}) => {
  const [initialProducts, setInitialProducts] = useState<ProductSearch[]>([])
  const [initHasMore, setInitHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (mode === 'manual' && selectedProducts) {
        setInitialProducts(selectedProducts as ProductSearch[])
        setInitHasMore(false)
        setLoading(false)
        return
      }

      try {
        const where: Record<string, any> = {}

        if (filterType === 'city' && city) {
          where.city = {
            equals: (city as City).id
          }
        }

        if (filterType === 'category' && category) {
          where.categories = {
            contains: (category as Category).id
          }
        }

        const { items, hasMore } = await fetchSearchResults({
          type: 'products',
          limit: limit ?? 4,
          page: 1,
          where,
        })

        setInitialProducts(items)
        setInitHasMore(hasMore)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载推荐产品失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [mode, selectedProducts, filterType, city, category, limit])

  if (error) {
    return (
      <section className={cn('container', className)}>
        <div className="text-center text-destructive">{error}</div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className={cn('container', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit ?? 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-muted-foreground/20 rounded-lg mb-4" />
              <div className="h-6 w-3/4 bg-muted-foreground/20 rounded mb-2" />
              <div className="h-4 w-1/4 bg-muted-foreground/20 rounded" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className={cn('container', className)}>
      <LoadMoreProducts
        initialProducts={initialProducts}
        initHasMore={initHasMore}
        mode={mode}
        filterType={filterType || undefined}
        city={city as City}
        category={category as Category}
        limit={limit || undefined}
        enableLoadMore={enableLoadMore || 'none'}
        loadMoreLimit={loadMoreLimit || 4}
      />
    </section>
  )
}
