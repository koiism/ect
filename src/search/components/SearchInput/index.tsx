'use client'

import { cn } from '@/utilities/cn'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SearchSuggestions } from '../SearchSuggestions'
import { SearchType } from '@/search/types'
import type { CitySearch } from '@/payload-types'

interface SearchInputProps {
  className?: string
  onSearch?: (value: string, type: SearchType) => void
  onSuggestionSelect?: (result: CitySearch) => void
  showSuggestions?: boolean
  placeholder?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    className,
    onSearch,
    onSuggestionSelect,
    showSuggestions = true,
    placeholder = 'Search...',
    ...props
  }, ref) => {
    const [value, setValue] = useState('')
    const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (onSearch) {
        onSearch(value, 'cities')
      } else {
        window.location.href = `/search?q=${encodeURIComponent(value)}`
      }
    }

    return (
      <div className="relative w-full">
        <form onSubmit={handleSubmit} className={cn('w-full', className)}>
          <div className="relative flex h-14 items-center">
            <input
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setShowSuggestionsDropdown(true)}
              className={cn(
                'h-full w-full rounded-full bg-transparent px-6 pr-12 text-base shadow-none outline-none placeholder:text-muted-foreground/75 border-muted-foreground/20 border',
                'text-ellipsis whitespace-nowrap overflow-hidden'
              )}
              placeholder={placeholder}
              title={placeholder}
              ref={ref}
              {...props}
            />
            <div className="absolute right-2">
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>

        {showSuggestions && showSuggestionsDropdown && (
          <SearchSuggestions
            keyword={value}
          />
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export { SearchInput }
