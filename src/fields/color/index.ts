import { Field } from 'payload'
import deepMerge from '@/utilities/deepMerge'

export const color = ({ overrides = {} }: { overrides?: Partial<Field> } = {}): Field => {
  return deepMerge({
    name: 'color',
    type: 'text',
    label: '颜色',
    defaultValue: '',
    admin: {
      position: 'sidebar',
      components: {
        Field: '@/fields/color/ColorPicker',
      },
    },
  }, overrides)
}
