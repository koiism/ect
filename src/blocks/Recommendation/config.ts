import type { Block } from 'payload'
import { BlockType } from '../constants'

export type LoadMoreType = 'none' | 'click' | 'auto'

export const RecommendationBlock: Block = {
  slug: BlockType.RecommendationBlock,
  labels: {
    singular: '热门推荐',
    plural: '热门推荐',
  },
  fields: [
    {
      name: 'mode',
      type: 'select',
      label: '推荐模式',
      defaultValue: 'auto',
      options: [
        {
          label: '自动推荐',
          value: 'auto',
        },
        {
          label: '手动选择',
          value: 'manual',
        },
      ],
      required: true,
    },
    {
      name: 'selectedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: '选择产品',
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'manual',
      },
    },
    {
      name: 'filterType',
      type: 'select',
      label: '筛选类型',
      defaultValue: 'all',
      options: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '按城市',
          value: 'city',
        },
        {
          label: '按分类',
          value: 'category',
        },
      ],
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'auto',
      },
      required: false,
    },
    {
      name: 'city',
      type: 'relationship',
      relationTo: 'cities',
      label: '选择城市',
      admin: {
        condition: (_data, siblingData) =>
          siblingData?.mode === 'auto' &&
          siblingData?.filterType === 'city',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: '选择分类',
      admin: {
        condition: (_data, siblingData) =>
          siblingData?.mode === 'auto' &&
          siblingData?.filterType === 'category',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: '显示数量',
      defaultValue: 4,
      min: 1,
      max: 12,
      required: true,
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'auto',
      },
    },
    {
      name: 'enableLoadMore',
      type: 'select',
      label: '加载更多',
      defaultValue: 'none',
      options: [
        {
          label: '不启用',
          value: 'none',
        },
        {
          label: '点击加载',
          value: 'click',
        },
        {
          label: '自动加载',
          value: 'auto',
        },
      ],
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'auto',
      },
    },
    {
      name: 'loadMoreLimit',
      type: 'number',
      label: '每次加载数量',
      defaultValue: 4,
      min: 1,
      max: 12,
      admin: {
        condition: (_data, siblingData) =>
          siblingData?.mode === 'auto' &&
          siblingData?.enableLoadMore !== 'none',
      },
    },
  ],
  interfaceName: BlockType.RecommendationBlock,
}
