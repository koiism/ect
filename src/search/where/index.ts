import { Where } from '@/utilities/payloadClientTypes'
import { SearchType } from '../types'
import { postsWhere } from './posts'
import { productsWhere } from './products'
import { citiesWhere } from './cities'

export const searchWhere = ({
  query,
  type,
  where,
}: {
  query?: string
  type: SearchType
  where?: Where
}): Where => {
  if (!query) {
    return where || {}
  }

  let searchWhere: Where = {}

  switch (type) {
    case 'posts':
      searchWhere = postsWhere(query)
      break
    case 'products':
      searchWhere = productsWhere(query)
      break
    case 'cities':
      searchWhere = citiesWhere(query)
      break
  }

  if (where) {
    searchWhere = {
      ...searchWhere,
      ...where,
    }
  }

  return searchWhere
}

export { postsWhere, productsWhere, citiesWhere }
