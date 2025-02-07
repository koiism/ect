import { deepMerge, Field } from 'payload'
import { iconOptions } from './options'

export type { IconType } from './options'
export { iconOptions }

export const icon = ({ overrides = {} } = {}): Field => {
  return deepMerge({
    name: 'icon',
    type: 'select' as const,
    label: '图标',
    required: true,
    defaultValue: '',
    options: Object.entries(iconOptions).map(([value, label]) => ({
      label,
      value,
    })),
    admin: {
      components: {
        Field: '@/fields/icon/IconSelect',
      },
    },
  }, overrides)
}
