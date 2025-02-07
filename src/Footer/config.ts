import type { GlobalConfig } from 'payload'

import { revalidateFooter } from './hooks/revalidateFooter'
import { linkGroup } from '@/fields/linkGroup'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: '全局设置',
  },
  access: {
    read: () => true,
  },
  fields: [
    linkGroup({
      label: '底部导航',
      name: 'navItems',
      maxRows: 6,
      minRows: 1,
    }),
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
