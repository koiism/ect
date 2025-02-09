import { MetaImageField } from '@payloadcms/plugin-seo/fields'
import { Field } from 'payload'

export const imageField = (overrides = {}): Field =>
  MetaImageField({
    relationTo: 'media',
    ...overrides,
  })
