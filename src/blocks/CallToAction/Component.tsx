'use client'

import React from 'react'
import type { CallToActionBlock as CallToActionBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Button } from '@/components/ui/button'
import { Icons } from '@/fields/icon/options'

type Props = {
  className?: string
} & CallToActionBlockProps

export const CallToActionBlock: React.FC<Props> = ({
  className,
  title,
  description,
  buttonText,
  icon,
}) => {
  const IconComponent = icon ? Icons[icon] : null

  return (
    <div className="container mx-auto">
      <div className={cn(
        'px-4 py-2 md:px-8 md:py-4 bg-gradient-to-r from-gradient-start to-gradient-end rounded-3xl mx-auto flex items-center justify-between gap-2 md:gap-4 md:max-w-4xl w-full md:min-h-32 flex-col md:flex-row',
        className
      )}>
        <div className="space-y-2 h-full flex flex-col justify-between text-foreground dark:invert">
          <h2 className="text-lg md:text-xl font-medium tracking-tight capitalize font-serif">
            {title}
          </h2>
          <p className="text-sm md:text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>
          <Button
            size="lg"
            variant="secondary"
          >
            {buttonText}
            {IconComponent && (
              <IconComponent className="ml-2 h-5 w-5" />
            )}
          </Button>
      </div>
    </div>
  )
}
