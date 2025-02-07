import { Block } from 'payload'
import { BlockType } from '../constants'
import { contentBlocks } from '../contentBlocks'

export const Column: Block = {
  slug: BlockType.ColumnBlock,
  labels: {
    singular: '列布局',
    plural: '列布局',
  },
  fields: [
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: '左对齐', value: 'start' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'end' },
      ],
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: '小间距', value: 'small' },
        { label: '中等间距', value: 'medium' },
        { label: '大间距', value: 'large' },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: contentBlocks,
    },
  ],
  interfaceName: 'ColumnBlock',
}
