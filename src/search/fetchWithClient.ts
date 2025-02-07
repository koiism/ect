import { getPayload } from '@/utilities/payloadClient'
import { SearchType, SearchTypeMap, SearchResults, searchCollectionSlugMap } from './types'
import { searchWhere } from './where'
import { Where } from 'payload'

export async function fetchSearchResults<T extends SearchType>(
  {
    type,
    page = 1,
    limit = 8,
    query,
    where,
  }: {
    type: T
    page?: number
    limit?: number
    query?: string
    where?: Where
  }
): Promise<SearchResults<SearchTypeMap[T]>> {
  const payload = getPayload()

  const searchCollection = searchCollectionSlugMap[type]

  const results = await payload.find({
    collection: searchCollection,
    where: searchWhere({ query, type, where }),
    depth: 1,
    limit,
    page,
  })

  const items = results.docs as unknown as SearchTypeMap[T][]

  return {
    items,
    hasMore: results.hasNextPage,
    total: results.totalDocs,
  }
}
