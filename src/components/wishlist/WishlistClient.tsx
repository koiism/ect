'use client'

import React, { useEffect, useState } from 'react'
import { ProductSearch } from '@/payload-types'
import { WishlistEmpty } from '@/components/wishlist/WishlistEmpty'
import { WishlistLoading } from '@/components/wishlist/WishlistLoading'
import { ProductGrid } from '@/components/products/ProductGrid'
import { WishlistPagination } from '@/components/wishlist/WishlistPagination'
import { fetchSearchResults } from '@/search/fetchWithClient'

const ITEMS_PER_PAGE = 12

export const WishlistClient: React.FC = () => {
  const [products, setProducts] = useState<ProductSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        setLoading(true)
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')

        if (wishlist.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        const productSlugs = wishlist
          .filter((item: any) => item.collection === 'products')
          .map((item: any) => item.slug)

        const start = (currentPage - 1) * ITEMS_PER_PAGE
        const end = start + ITEMS_PER_PAGE

        const currentPageSlugs = productSlugs.slice(start, end)

        if (currentPageSlugs.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        const response = await fetchSearchResults({
          type: 'products',
          limit: Math.min(ITEMS_PER_PAGE, productSlugs.length),
          where: {
            slug: {
              in: currentPageSlugs,
            },
          },
        })

        setProducts(response.items)
        setTotalPages(Math.ceil(productSlugs.length / ITEMS_PER_PAGE))
      } catch (error) {
        console.error('Error fetching wishlist products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchWishlistProducts()
  }, [currentPage])

  if (loading) {
    return <WishlistLoading />
  }

  if (products.length === 0) {
    return <WishlistEmpty />
  }

  return (
    <>
      <ProductGrid products={products} />
      {totalPages > 1 && (
        <WishlistPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}
