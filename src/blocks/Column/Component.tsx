import type { ColumnBlock as ColumnBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { RenderBlocks } from '../RenderBlocks'

type Props = {
  className?: string
} & ColumnBlockProps

const alignmentClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

const spacingClasses = {
  small: 'space-y-4',
  medium: 'space-y-8',
  large: 'space-y-12',
}

export const ColumnBlock: React.FC<Props> = ({
  className,
  blocks,
  alignment = 'center',
  spacing = 'medium',
}) => {
  if (!blocks?.length) return null

  return (
    <div
      className={cn(
        'flex flex-col',
        alignmentClasses[alignment!],
        spacingClasses[spacing!],
        className,
      )}
    >
      <RenderBlocks blocks={blocks} />
    </div>
  )
}
