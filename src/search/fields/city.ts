import type { Field } from 'payload'
import { baseSearchFields } from './base'

export const citySearchFields: Field[] = [
  ...baseSearchFields,
  {
    name: 'slug',
    type: 'text',
    admin: {
      readOnly: true,
    },
  },
]
