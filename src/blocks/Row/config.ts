import type { Block } from 'payload'
import { BlockType } from '../constants'
import { contentBlocks } from '../contentBlocks'

export const Row: Block = {
  slug: BlockType.RowBlock,
  labels: {
    singular: '行布局',
    plural: '行布局',
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
        { label: '两端对齐', value: 'between' },
      ],
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: '顶部对齐', value: 'start' },
        { label: '居中对齐', value: 'center' },
        { label: '底部对齐', value: 'end' },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: contentBlocks,
      required: true,
    },
  ],
  interfaceName: 'RowBlock',
}
