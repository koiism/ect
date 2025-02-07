import React from 'react'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { Button } from '../ui/button'

type Props = {
  className?: string
  isSearch?: boolean
  tags: Array<{
    text: string
    link?: string
    isLink?: boolean
    newTab?: boolean
  }>
}

export const TrendingTags: React.FC<Props> = ({ className, tags, isSearch = true }) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag, index) => {
        let link = ''
        if (tag.isLink) {
          link = tag.link ?? ''
        } else if (isSearch) {
          link = `/search?q=${tag.text}`
        }

        return (
          <div key={index} className="inline-flex items-center">
            <Button
              asChild
              variant="secondary"
              className="text-sm font-normal text-foreground hover:text-foreground/75 h-auto px-3 py-1"
              size="rounded"
            >
              <Link
                href={link}
                target={tag.newTab ? '_blank' : undefined}
                rel={tag.newTab ? 'noopener noreferrer' : undefined}
              >
                {tag.text}
              </Link>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
