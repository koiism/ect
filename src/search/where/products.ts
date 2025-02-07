import { Where } from '@/utilities/payloadClientTypes'

export const productsWhere = (query?: string): Where => {
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
      {
        'city.title': {
          like: query,
        },
      },
      {
        summary: {
          like: query,
        },
      },
      {
        'image.alt': {
          like: query,
        },
      },
    ],
  }
}
