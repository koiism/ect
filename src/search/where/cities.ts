import { Where } from '@/utilities/payloadClientTypes'

export const citiesWhere = (query?: string): Where => {
  if (!query) {
    return {}
  }

  return {
    or: [
      {
        title: {
          like: query,
        },
      },
      {
        'categories.title': {
          like: query,
        },
      },
    ],
  }
}
