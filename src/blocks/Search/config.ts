import { Block } from 'payload'
import { BlockType } from '../constants'
import { link } from '@/fields/link'

export const SearchBlock: Block = {
  slug: BlockType.SearchBlock,
  labels: {
    singular: '搜索块',
    plural: '搜索块',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '标题',
      defaultValue: "Explore China's Magnificent Destinations",
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '副标题',
      defaultValue: 'Discover ancient wonders, breathtaking landscapes, and vibrant culture across the Middle Kingdom',
    },
    {
      name: 'placeholder',
      type: 'text',
      label: '搜索框占位文本',
      defaultValue: 'Search destinations, attractions, or experiences...',
    },
    {
      name: 'trendingSearches',
      type: 'array',
      label: '热门搜索',
      defaultValue: [],
      fields: [
        link({
          disableLabel: false,
          appearances: false,
        }),
      ],
    },
  ],
  interfaceName: 'SearchBlock',
}
