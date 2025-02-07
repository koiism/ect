import React from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import type { ProductSearch } from '@/payload-types'
import type { ProductCardBlock as ProductCardBlockProps } from '@/payload-types'

export const ProductCardBlock: React.FC<ProductCardBlockProps> = ({
  products,
}) => {
  const validProducts = products.filter((product): product is ProductSearch =>
    typeof product !== 'string' && Boolean(product)
  )

  return (
    <>
      {validProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className="w-full"
        />
      ))}
    </>
  )
}
