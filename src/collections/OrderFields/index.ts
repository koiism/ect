import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { fields } from '@payloadcms/plugin-form-builder'

export const OrderFields: CollectionConfig = {
  slug: 'order-fields',
  admin: {
    group: '业务数据',
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  labels: {
    singular: '订单字段',
    plural: '订单字段',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: '名称',
      type: 'text',
      required: true,
    },
    {
      name: 'fields',
      label: '字段',
      type: 'blocks',
      blocks: Object.entries(fields).map(([slug, component]) => ({
        slug,
        fields: [
          {
            name: 'name',
            label: '字段名称',
            type: 'text',
            required: true,
          },
          {
            name: 'label',
            label: '显示名称',
            type: 'text',
          },
          {
            name: 'width',
            label: '宽度',
            type: 'number',
          },
          {
            name: 'required',
            label: '必填',
            type: 'checkbox',
          },
          {
            name: 'defaultValue',
            label: '默认值',
            type: 'text',
            admin: {
              condition: (data, siblingData) => {
                return ['text', 'textarea', 'number', 'checkbox', 'select'].includes(siblingData.blockType)
              }
            }
          },
          {
            name: 'options',
            label: '选项',
            type: 'array',
            fields: [
              {
                name: 'label',
                label: '显示名称',
                type: 'text',
                required: true,
              },
              {
                name: 'value',
                label: '值',
                type: 'text',
                required: true,
              }
            ],
            admin: {
              condition: (data, siblingData) => siblingData.blockType === 'select'
            }
          }
        ]
      }))
    }
  ],
  versions: {
    drafts: true,
  },
}
