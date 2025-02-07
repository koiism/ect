'use client'

import React from 'react'
import type { IconType } from '@/fields/icon'
import { Icons } from '@/fields/icon/options'

type IconProps = {
  name: IconType
  className?: string
}

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = Icons[name]

  if (!IconComponent) {
    return null
  }

  return <IconComponent className={className} />
}
