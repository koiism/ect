import React from 'react'
import { Title } from '@/components/ui/title'
import { cn } from '@/utilities/cn'
import type { TitleBlock as TitleBlockType } from '@/payload-types'
import type { TitleProps } from '@/components/ui/title'

type Props = {
  className?: string
} & TitleBlockType

export const TitleBlock: React.FC<Props> = ({
  className,
  title,
  subtitle,
  variant = 'center',
  color = 'primary',
  size = 'default',
  textTransform = 'uppercase',
  weight = 'bold',
}) => {
  return (
    <div className={cn('container', className)}>
      <Title
        title={title}
        variant={variant}
        color={color as TitleProps['color']}
        size={size as TitleProps['size']}
        textTransform={textTransform as TitleProps['textTransform']}
        weight={weight as TitleProps['weight']}
        className="mb-2"
      />
      {subtitle && (
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}
