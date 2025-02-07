import type { Block } from 'payload'
import { BlockType } from '../constants'
import { contentBlocks } from '../contentBlocks'

export const Grid: Block = {
  slug: BlockType.GridBlock,
  labels: {
    singular: '网格布局',
    plural: '网格布局',
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '1列', value: '1' },
        { label: '2列', value: '2' },
        { label: '3列', value: '3' },
        { label: '4列', value: '4' },
      ],
      required: true,
    },
    {
      name: 'gap',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: '小间距', value: 'small' },
        { label: '中间距', value: 'medium' },
        { label: '大间距', value: 'large' },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: contentBlocks,
      required: true,
    },
  ],
  interfaceName: 'GridBlock',
}
