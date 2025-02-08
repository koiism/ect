import type { Block } from 'payload'
import { BlockType } from '../constants'

export const TitleBlock: Block = {
  slug: BlockType.TitleBlock,
  labels: {
    singular: '标题块',
    plural: '标题块',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '标题',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '副标题',
      localized: true,
    },
    {
      name: 'variant',
      type: 'select',
      label: '样式变体',
      defaultValue: 'center',
      options: [
        {
          label: '居中',
          value: 'center',
        },
        {
          label: '左对齐',
          value: 'left',
        },
        {
          label: '右对齐',
          value: 'right',
        },
      ],
    },
    {
      name: 'color',
      type: 'select',
      label: '颜色',
      defaultValue: 'primary',
      options: [
        {
          label: '前景色',
          value: 'foreground',
        },
        {
          label: '主色',
          value: 'primary',
        },
        {
          label: '次要色',
          value: 'secondary',
        },
        {
          label: '暗色',
          value: 'muted',
        },
        {
          label: '暗前景色',
          value: 'mutedForeground',
        },
      ],
    },
    {
      name: 'size',
      type: 'select',
      label: '大小',
      defaultValue: 'default',
      options: [
        {
          label: '特小',
          value: 'xs',
        },
        {
          label: '小',
          value: 'sm',
        },
        {
          label: '默认',
          value: 'default',
        },
        {
          label: '大',
          value: 'lg',
        },
        {
          label: '特大',
          value: 'xl',
        },
      ],
    },
    {
      name: 'textTransform',
      type: 'select',
      label: '文字转换',
      defaultValue: 'uppercase',
      options: [
        {
          label: '大写',
          value: 'uppercase',
        },
        {
          label: '小写',
          value: 'lowercase',
        },
        {
          label: '首字母大写',
          value: 'capitalize',
        },
        {
          label: '正常',
          value: 'normal',
        },
      ],
    },
    {
      name: 'weight',
      type: 'select',
      label: '字重',
      defaultValue: 'bold',
      options: [
        {
          label: '常规',
          value: 'normal',
        },
        {
          label: '中等',
          value: 'medium',
        },
        {
          label: '粗体',
          value: 'bold',
        },
      ],
    },
  ],
  interfaceName: BlockType.TitleBlock,
}
