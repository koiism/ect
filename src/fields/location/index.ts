import { Field } from 'payload'
import deepMerge from '@/utilities/deepMerge'

export const location = ({ overrides = {} }: { overrides?: Partial<Field> } = {}): Field => {
  return deepMerge({
    name: 'location',
    type: 'group',
    label: '位置',
    fields: [
      {
        name: 'lat',
        type: 'number',
        required: true,
        admin: {
          hidden: true,
        },
      },
      {
        name: 'lng',
        type: 'number',
        required: true,
        admin: {
          hidden: true,
        },
      },
      {
        name: 'address',
        type: 'text',
        admin: {
          hidden: true,
        },
      }
    ],
    admin: {
      components: {
        Field: '@/fields/location/LocationPicker',
      },
    },
  }, overrides)
}
