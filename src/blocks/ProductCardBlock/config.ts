import type { Block } from 'payload'
import { BlockType } from '../constants'

export const ProductBlock: Block = {
  slug: BlockType.ProductCardBlock,
  labels: {
    singular: '产品卡片',
    plural: '产品卡片',
  },
  fields: [
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'product-search',
      hasMany: true,
      label: '选择产品',
      required: true,
    },
  ],
  interfaceName: BlockType.ProductCardBlock,
}
