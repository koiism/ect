'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'
import { Loader2 } from 'lucide-react'
import type { CitySearch, ProductSearch } from '@/payload-types'
import { fetchSearchResults } from '@/search/fetchWithClient'
import { Icon } from '@/components/Icon'

interface SearchSuggestionsProps {
  keyword: string
  className?: string
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  keyword,
  className,
}) => {
  const [citiesResults, setCitiesResults] = useState<CitySearch[]>([])
  const [productsResults, setProductsResults] = useState<ProductSearch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchItems = async () => {
      if (keyword) {
        setLoading(true)
        setError(null)
        setCitiesResults([])
        setProductsResults([])
        try {
          const citiesResultPromise = fetchSearchResults({
            type: 'cities',
            query: keyword,
            limit: 5,
            page: 1
          })

          const productsResultPromise = fetchSearchResults({
            type: 'products',
            query: keyword,
            limit: 5,
            page: 1
          })

          const [citiesResult, productsResult] = await Promise.all([citiesResultPromise, productsResultPromise])
          setCitiesResults(citiesResult.items)
          setProductsResults(productsResult.items)
        } catch (err) {
          setError(err instanceof Error ? err.message : '搜索出错')
        } finally {
          setLoading(false)
        }
      } else {
        setCitiesResults([])
        setProductsResults([])
      }
    }

    const timer = setTimeout(searchItems, 300)
    return () => clearTimeout(timer)
  }, [keyword])

  if (!keyword) return null

  if (loading) {
    return (
      <div className={cn(
        'absolute top-full z-50 mt-2 w-full rounded-lg bg-popover/80 p-4 shadow-lg',
        'backdrop-blur-md transition-all duration-200 animate-in fade-in',
        className
      )}>
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground transition-opacity duration-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn(
        'absolute top-full z-50 mt-2 w-full rounded-lg bg-popover/80 p-4 shadow-lg',
        'backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2',
        className
      )}>
        <p className="text-center text-sm text-destructive animate-in fade-in duration-200">{error}</p>
      </div>
    )
  }

  if (citiesResults.length === 0 && productsResults.length === 0) {
    return null
  }

  return (
    <div className={cn(
      'absolute top-full z-50 mt-2 w-full bg-muted/80 shadow-lg rounded-xl overflow-hidden',
      'backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2',
      className
    )}>
      <ul className="divide-y divide-border">
        {citiesResults.map((result, index) => (
          <li
            key={result.id}
            className={cn(
              'animate-in fade-in slide-in-from-top-1 border-none',
              'transition-all duration-200',
              `delay-[${index * 50}ms]`
            )}
          >
            <a
              href={`/cities/${result.slug}`}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-muted/50"
            >
              <div className='flex items-center gap-2'>
                <Icon name='HiLocationMarker' className='h-4 w-4 text-muted-foreground' />
                <h3 className="text-sm font-medium">{result.title}</h3>
              </div>
            </a>
          </li>
        ))}
        {productsResults.map((result, index) => (
          <li
            key={result.id}
            className={cn(
              'animate-in fade-in slide-in-from-top-1 border-none',
              'transition-all duration-200',
              `delay-[${index * 50}ms]`
            )}
          >
            <a
              href={`/products/${result.slug}`}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-muted/50"
            >
              <div className='flex items-center gap-2'>
                <h3 className="text-sm font-medium">{result.title}</h3>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
