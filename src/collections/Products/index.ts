import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'

export const uiPopulate = {
  title: true,
  images: true,
  summary: true,
  slug: true,
  aboutThisTour: true,
  city: true,
  lowestPrice: true,
} as const

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: '产品',
    plural: '产品',
  },
  admin: {
    group: '页面',
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    meta: {
      image: true,
      description: true,
    },
    ...uiPopulate,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: '标题',
    },
    {
      name: 'lowestPrice',
      type: 'number',
      label: '最低价格',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: '自动计算的最低价格',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: '内容',
          fields: [
            {
              name: 'images',
              label: '图片',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  label: '图片',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              index: true,
              label: '分类',
            },
            {
              name: 'summary',
              type: 'textarea',
              label: '简介',
              maxLength: 200,
              localized: true,
            },
            {
              name: 'aboutThisTour',
              type: 'group',
              fields: [
                {
                  name: 'cancellation',
                  label: '提前取消天数',
                  type: 'number',
                  defaultValue: 1,
                  required: true,
                },
                {
                  name: 'duration',
                  label: '游玩时长(小时)',
                  type: 'number',
                  defaultValue: 1,
                  required: true,
                },
                {
                  name: 'disabledFriendly',
                  label: '残疾人友好',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'skipTicketLine',
                  label: '无需排队',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              label: '产品亮点/注意事项',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
              admin: {
                description: '添加产品亮点或重要注意事项',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: '详细描述',
              minLength: 500,
              maxLength: 3000,
              localized: true,
            },
            {
              name: 'includes',
              type: 'array',
              label: '产品包含',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
            {
              name: 'excludes',
              type: 'array',
              label: '产品不包含',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
            {
              name: 'importantInfo',
              type: 'array',
              label: '重要信息',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: '标题',
                  localized: true,
                },
                {
                  name: 'content',
                  type: 'array',
                  label: '内容',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'city',
              type: 'relationship',
              relationTo: 'cities',
              hasMany: false,
              index: true,
              label: '所在城市',
            },
            {
              name: 'productOptions',
              type: 'join',
              label: '产品选项',
              collection: 'product-options',
              on: 'product',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [],
        },
      ],
    },
    ...slugField(),
  ],
  versions: {
    drafts: true,
  },
}
