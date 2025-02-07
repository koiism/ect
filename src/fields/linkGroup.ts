import type { ArrayField, Field } from 'payload'

import type { LinkAppearances } from './link'

import deepMerge from '@/utilities/deepMerge'
import { link } from './link'

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false
  overrides?: Partial<ArrayField>
  label?: string
  name?: string
  maxRows?: number
  minRows?: number
}) => Field

export const linkGroup: LinkGroupType = ({ appearances, overrides = {}, label, name = 'links', maxRows, minRows } = {}) => {
  const generatedLinkGroup: Field = {
    name,
    type: 'array',
    label,
    admin: {
      components: {
        RowLabel: '@/fields/linkLabel',
      },
    },
    ...(maxRows !== undefined && { maxRows }),
    ...(minRows !== undefined && { minRows }),
    fields: [
      link({
        appearances,
      }),
    ],
  }

  return deepMerge(generatedLinkGroup, overrides)
}
