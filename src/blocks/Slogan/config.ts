import type { Block } from 'payload'
import { BlockType } from '../constants'
import { link } from '@/fields/link'

export const SloganBlock: Block = {
  slug: BlockType.SloganBlock,
  labels: {
    singular: '标语横幅',
    plural: '标语横幅',
  },
  fields: [
    {
      name: 'keywords',
      type: 'array',
      label: '关键词列表',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: '文本',
              required: true,
              localized: true,
            },
            {
              type: 'checkbox',
              name: 'isLink',
              label: '是否为链接',
              defaultValue: false,
            },
          ],
        },
        link({ disableLabel: true, overrides: {
          admin: {
            condition: (_: any, siblingData: { isLink: any }) => siblingData.isLink,
          },
        } }),
      ],
    },
  ],
  interfaceName: BlockType.SloganBlock,
}
