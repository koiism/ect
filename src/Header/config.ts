import type { GlobalConfig } from 'payload'

import { revalidateHeader } from './hooks/revalidateHeader'
import { linkGroup } from '@/fields/linkGroup'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    group: '全局设置',
  },
  access: {
    read: () => true,
  },
  fields: [
    linkGroup({
      label: '导航',
      appearances: false,
      name: 'navItems',
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
