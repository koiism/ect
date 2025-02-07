import { Product, Post, City } from '@/payload-types'

export type SearchType = 'products' | 'posts' | 'cities'

export interface BaseSearchResult {
  id: string
  title: string
  slug: string
  meta?: {
    title?: string
    description?: string
    image?: {
      id: string
      url: string
    }
  }
}

export interface ProductSearchResult extends BaseSearchResult {
  type: 'products'
  city?: {
    id: string
    title: string
  }
  product: Product
}

export interface PostSearchResult extends BaseSearchResult {
  type: 'posts'
  post: Post
}

export interface CitySearchResult extends BaseSearchResult {
  type: 'cities'
  city: City
}

export type SearchResult = ProductSearchResult | PostSearchResult | CitySearchResult

export interface SearchState {
  query: string
  type: SearchType
  results: SearchResult[]
  loading: boolean
  error: string | null
}

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: SearchType
  onSearch?: (value: string, type: SearchType) => void
  onSuggestionSelect?: (suggestion: SearchResult) => void
  showSuggestions?: boolean
  placeholder?: string
  className?: string
}
