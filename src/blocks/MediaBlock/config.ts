import type { Block } from 'payload'
import { BlockType } from '../constants'

export const MediaBlock: Block = {
  slug: BlockType.MediaBlock,
  labels: {
    singular: '媒体',
    plural: '媒体',
  },
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
