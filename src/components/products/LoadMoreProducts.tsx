'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Category, City, Product, ProductSearch } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ProductGrid } from './ProductGrid'
import { fetchSearchResults } from '@/search/fetchWithClient'

export type LoadMoreType = 'none' | 'click' | 'auto'

type Props = {
  initialProducts: ProductSearch[]
  initHasMore: boolean
  mode: 'auto' | 'manual'
  filterType?: string
  city?: City
  category?: Category
  limit?: number
  enableLoadMore?: LoadMoreType
  loadMoreLimit?: number
}

export const LoadMoreProducts: React.FC<Props> = ({
  initialProducts,
  initHasMore,
  mode,
  filterType,
  city,
  category,
  enableLoadMore = 'none',
  loadMoreLimit = 4,
}) => {
  const [products, setProducts] = useState<ProductSearch[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initHasMore)
  const [page, setPage] = useState(initialProducts.length > 0 ? 2 : 1)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const loadProducts = useCallback(async () => {
    if (loading || !hasMore || mode !== 'auto') return

    setLoading(true)
    try {
      const where: Record<string, any> = {}

      if (filterType === 'city' && city) {
        where.city = {
          equals: city.id,
        }
      }

      if (filterType === 'category' && category) {
        where.categories = {
          contains: category.id,
        }
      }

      const { items: newProducts, hasMore: hasNextPage } = await fetchSearchResults({
        limit: loadMoreLimit,
        type: 'products',
        page,
      })

      setProducts((prev) => [...prev, ...newProducts])
      setHasMore(hasNextPage)
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, mode, filterType, city, category, loadMoreLimit, page])

  useEffect(() => {
    if (enableLoadMore !== 'auto' || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadProducts()
        }
      },
      { threshold: 0.1 },
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enableLoadMore, hasMore, loading, loadProducts])

  return (
    <>
      <ProductGrid products={products} />

      {enableLoadMore !== 'none' && hasMore && mode === 'auto' && (
        <div ref={loadMoreRef} className="mt-8 text-center">
          {enableLoadMore === 'click' && (
            <Button onClick={() => loadProducts()} disabled={loading} variant="outline">
              {loading ? 'loading...' : 'load more'}
            </Button>
          )}
          {enableLoadMore === 'auto' && loading && (
            <p className="text-muted-foreground">loading...</p>
          )}
        </div>
      )}
    </>
  )
}
