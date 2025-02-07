'use client'

import React from 'react'
import type { Header } from '@/payload-types'
import { HeaderNavItem } from './HeaderNavItem'
import { cn } from '@/utilities/cn'

interface HeaderNavProps {
  header: Header
  className?: string
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ header, className }) => {
  return (
    <nav className={cn("flex items-center gap-4", className)}>
      {header?.navItems?.map((item, index) => {
        return <HeaderNavItem key={index} {...item} />
      })}
    </nav>
  )
}
