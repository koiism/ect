import type { RowBlock as RowBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { RenderBlocks } from '../RenderBlocks'

type Props = {
  className?: string
} & RowBlockProps

const alignmentClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

const verticalAlignmentClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

export const RowBlock: React.FC<Props> = ({
  className,
  blocks,
  alignment = 'center',
  verticalAlignment = 'center',
}) => {
  if (!blocks?.length) return null

  return (
    <div
      className={cn(
        'flex flex-wrap',
        alignmentClasses[alignment!],
        verticalAlignmentClasses[verticalAlignment!],
        className,
      )}
    >
      <RenderBlocks blocks={blocks} />
    </div>
  )
}
