'use client'

import { useState } from 'react'
import { Title } from '@/components/ui/title'
import { cn } from '@/utilities/cn'

interface DescriptionSectionProps {
  description: string
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="flex flex-col md:gap-4 gap-2">
      <Title title="Description" variant="left" size="sm" weight="bold" color="primary" />
      <div className="relative">
        <div className={cn(
          "prose dark:prose-invert max-w-none",
          !expanded && "line-clamp-3"
        )}>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary hover:text-primary/80 text-sm mt-2"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      </div>
    </section>
  )
}
