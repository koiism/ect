import type { Field } from 'payload'
import { baseSearchFields } from './base'

export const productSearchFields: Field[] = [
  ...baseSearchFields,
  {
    name: 'summary',
    type: 'text',
    localized: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'image',
    type: 'group',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'url',
        type: 'text',
      },
      {
        name: 'alt',
        type: 'text',
      }
    ]
  },
  {
    name: 'slug',
    type: 'text',
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'city',
    type: 'group',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        localized: true,
      },
      {
        name: 'themeColor',
        type: 'text',
      }
    ]
  },
  {
    name: 'aboutThisTour',
    type: 'group',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'cancellation',
        type: 'number',
      },
      {
        name: 'duration',
        type: 'number',
      },
      {
        name: 'disabledFriendly',
        type: 'checkbox',
      },
      {
        name: 'skipTicketLine',
        type: 'checkbox',
      }
    ]
  },
  {
    name: 'lowestPrice',
    type: 'number',
    admin: {
      readOnly: true,
    },
  }
]
