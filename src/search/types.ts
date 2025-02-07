import { CitySearch, PostSearch, ProductSearch } from '@/payload-types'

export type SearchType = 'posts' | 'products' | 'cities'
export type SearchCollectionSlug = 'post-search' | 'product-search' | 'city-search'
export type SearchTypeMap = {
  posts: PostSearch
  products: ProductSearch
  cities: CitySearch
}

export const searchCollectionSlugMap: Record<SearchType, SearchCollectionSlug> = {
  posts: 'post-search',
  products: 'product-search',
  cities: 'city-search',
}

export interface SearchResults<T> {
  items: T[]
  hasMore: boolean
  total: number
}
