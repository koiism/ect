import type { GridBlock as GridBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { RenderBlocks } from '../RenderBlocks'

type Props = {
  className?: string
} & GridBlockProps

const gapClasses = {
  small: 'gap-4',
  medium: 'gap-2 md:gap-8',
  large: 'gap-12',
}

const columnsClasses = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const GridBlock: React.FC<Props> = ({ className, blocks, columns = '3', gap = 'medium' }) => {
  if (!blocks?.length) return null

  return (
    <div className={cn('container grid', columnsClasses[columns!], gapClasses[gap!], className)}>
      <RenderBlocks blocks={blocks} />
    </div>
  )
}
