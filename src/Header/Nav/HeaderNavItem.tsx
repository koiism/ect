import React from 'react'
import { CMSLink } from '@/components/Link'
import type { Header } from '@/payload-types'

interface NavItem {
  link: NonNullable<Header['navItems']>[number]['link']
}

export const HeaderNavItem: React.FC<NavItem> = ({ link }) => {
  return <CMSLink {...link} appearance="inline" />
}
