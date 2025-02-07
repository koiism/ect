import type {
  SearchResult,
  SearchType,
  ProductSearchResult,
  PostSearchResult,
  CitySearchResult,
} from '../types/index'

export const getSearchTypeFromPath = (path: string): SearchType => {
  if (path.includes('/products')) return 'products'
  if (path.includes('/posts')) return 'posts'
  if (path.includes('/cities')) return 'cities'
  return 'products'
}

export const getSearchPlaceholder = (type: SearchType): string => {
  switch (type) {
    case 'products':
      return 'Search products...'
    case 'posts':
      return 'Search posts...'
    case 'cities':
      return 'Search cities...'
    default:
      return 'Search...'
  }
}

export const formatSearchResults = (results: any[], type: SearchType): SearchResult[] => {
  return results.map((result) => {
    const baseResult = {
      id: result.id,
      title: result.meta?.title || result.title,
      slug: result.slug,
      meta: {
        title: result.meta?.title,
        description: result.meta?.description,
        image: result.meta?.image,
      },
    }

    switch (type) {
      case 'products':
        return {
          ...baseResult,
          type: 'products',
          city: result.city,
          product: result,
        } as ProductSearchResult
      case 'posts':
        return {
          ...baseResult,
          type: 'posts',
          post: result,
        } as PostSearchResult
      case 'cities':
        return {
          ...baseResult,
          type: 'cities',
          city: result,
        } as CitySearchResult
      default:
        throw new Error(`Invalid search type: ${type}`)
    }
  })
}
