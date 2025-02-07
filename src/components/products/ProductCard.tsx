'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import type { ProductSearch } from '@/payload-types'
import { Icon } from '../Icon'

interface Props {
  product: ProductSearch
  className?: string
}

export const ProductCard: React.FC<Props> = ({ product, className }) => {
  const { title, summary, slug, city, lowestPrice, image, aboutThisTour } = product
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setIsInWishlist(wishlist.some((item: { slug: string }) => item.slug === product.slug))
  }, [product.slug])

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')

    if (isInWishlist) {
      const newWishlist = wishlist.filter((item: { slug: string }) => item.slug !== product.slug)
      localStorage.setItem('wishlist', JSON.stringify(newWishlist))
      setIsInWishlist(false)
    } else {
      wishlist.push({
        slug: product.slug,
        collection: 'products',
      })
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
      setIsInWishlist(true)
    }
  }

  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg h-full',
        className,
      )}
    >
      <button
        onClick={handleWishlist}
        className="absolute right-1.5 top-1.5 z-10 rounded-full bg-background/80 p-1.5 sm:p-2 backdrop-blur-sm transition-all hover:bg-background"
      >
        <Icon
          name={isInWishlist ? 'HiHeart' : 'HiOutlineHeart'}
          className={cn(
            'h-4 w-4 sm:h-5 sm:w-5 transition-colors',
            isInWishlist ? 'text-red-500' : 'text-foreground',
          )}
        />
      </button>

      <div className="relative w-full overflow-hidden aspect-[16/9]">
        {image && (
          <Image
            src={typeof image.url === 'string' ? image.url : image.url || ''}
            alt={image.alt || title || ''}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-3">
        <h3 className="line-clamp-1 md:line-clamp-2 text-sm md:text-lg font-medium text-card-foreground mb-1">
          {title}
        </h3>

        {city && typeof city !== 'string' && (
          <div className="mb-1">
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs md:text-sm font-medium"
              style={{
                color: city.themeColor || 'var(--primary)',
                backgroundColor: city.themeColor ? `${city.themeColor}1A` : 'var(--primary-10)',
              }}
            >
              <Icon name="HiLocationMarker" className="mr-1 h-3 w-3" />
              {city.title}
            </span>
          </div>
        )}

        {summary && (
          <p className="line-clamp-2 text-xs md:text-sm text-muted-foreground mb-auto">
            {summary}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-1 mt-1 sm:mt-2">
          <div className="sm:flex flex-wrap gap-1 text-xs md:text-sm text-muted-foreground">
            {aboutThisTour?.duration && (
              <span className="inline-flex items-center">{aboutThisTour.duration} hours</span>
            )}
            {aboutThisTour?.duration && aboutThisTour?.skipTicketLine && (
              <span className="hidden sm:inline-flex items-center">•</span>
            )}
            {aboutThisTour?.skipTicketLine && (
              <span className="hidden sm:inline-flex items-center truncate">Skip ticket line</span>
            )}
          </div>

          {typeof lowestPrice === 'number' && lowestPrice > 0 && (
            <div className="text-xs md:text-base font-bold">
              <span className="text-muted-foreground">From </span>
              <span className="text-red-500">${lowestPrice}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
