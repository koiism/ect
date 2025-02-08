import { Block } from 'payload'
import { BlockType } from '../constants'
import { link } from '@/fields/link'

export const TrendingTagsBlock: Block = {
  slug: BlockType.TrendingTagsBlock,
  labels: {
    singular: '热门标签块',
    plural: '热门标签块',
  },
  fields: [
    {
      name: 'tags',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      labels: {
        singular: '标签',
        plural: '标签',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: '标签文本',
          localized: true,
        },
        {
          name: 'isLink',
          type: 'checkbox',
          label: '是否为自定义链接',
          defaultValue: false,
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            admin: {
              condition: (_: any, siblingData: { isLink: any }) => siblingData?.isLink,
            },
          },
        }),
      ],
    },
  ],
  interfaceName: BlockType.TrendingTagsBlock,
}
