import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { color } from '@/fields/color'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const Cities: CollectionConfig = {
  slug: 'cities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: '业务数据',
  },
  labels: {
    singular: '城市',
    plural: '城市',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    themeColor: true,
    image: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: '名称',
    },
    {
      name: 'image',
      label: '主图',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    color({
      overrides: {
        name: 'themeColor',
        required: true,
        label: '主题色',
        admin: {
          description: '设置城市的主题颜色',
        },
      },
    }),
    ...slugField(),
  ],
  versions: {
    drafts: true,
  },
}
