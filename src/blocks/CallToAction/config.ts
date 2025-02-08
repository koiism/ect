import type { Block } from 'payload'
import { BlockType } from '../constants'
import { icon } from '@/fields/icon'

export const CallToActionBlock: Block = {
  slug: BlockType.CallToActionBlock,
  labels: {
    singular: '号召性按钮块',
    plural: '号召性按钮块',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '标题',
      defaultValue: 'start your journey',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述文案',
      defaultValue: 'Explore the cultural treasures of China and experience the unique travel time',
      localized: true,
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      label: '按钮文案',
      defaultValue: 'Book Now',
      localized: true,
      required: true,
    },
    icon({
      overrides: {
        defaultValue: 'HiChevronRight',
      },
    }),
  ],
  interfaceName: BlockType.CallToActionBlock,
}
