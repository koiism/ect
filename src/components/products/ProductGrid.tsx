'use client'

import React from 'react'
import { ProductSearch } from '@/payload-types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: ProductSearch[]
  className?: string
}

export function ProductGrid({ products, className = '' }: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 grid-flow-row-dense ${className}`}
    >
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
