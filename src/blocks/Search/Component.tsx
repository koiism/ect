'use client'

import React from 'react'
import { SearchInput } from '@/search/components/SearchInput'
import { TrendingTags } from '@/components/TrendingTags'
import { SearchBlock as SearchBlockProps } from '@/payload-types'
import { getLinkPath } from '@/utilities/getLinkPath'
import type { SearchType } from '@/search/types'

export const SearchBlock: React.FC<SearchBlockProps & { type?: SearchType }> = ({
  title = "Explore China's Most Beautiful Travel Destinations",
  subtitle = 'Discover breathtaking sights, unique cultural experiences, and unforgettable journeys',
  placeholder = 'Search for destinations, attractions, or experiences...',
  trendingSearches,
  type = 'products',
}) => {
  return (
    <section className="container mx-auto px-4 pt-0 md:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 font-serif text-5xl font-medium tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
        <div className="mb-8">
          <SearchInput
            placeholder={placeholder || undefined}
            showSuggestions
          />
        </div>
        {trendingSearches && trendingSearches.length > 0 && (
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Trending Searches
            </span>
            <TrendingTags
              tags={trendingSearches.map((item) => ({
                text: item.link.label,
                link: getLinkPath(item.link),
                isLink: true,
                newTab: Boolean(item.link.newTab),
              }))}
            />
          </div>
        )}
      </div>
    </section>
  )
}
