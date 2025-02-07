import React from 'react'
import { TrendingTags } from '@/components/TrendingTags'
import { TrendingTagsBlock as TrendingTagsBlockType } from '@/payload-types'
import { getLinkPath } from '@/utilities/getLinkPath'

type Props = {
  className?: string
} & TrendingTagsBlockType

export const TrendingTagsBlock: React.FC<Props> = ({
  className,
  tags,
}) => {
  const formattedTags = tags.map(tag => {
    const link = tag.link ? {
      type: tag.link.type,
      reference: tag.link.reference,
      url: tag.link.url,
      newTab: tag.link.newTab
    } : undefined

    return {
      text: tag.text,
      isLink: tag.isLink ?? false,
      link: tag.isLink && link ? getLinkPath(link) : '#',
      newTab: tag.link?.newTab ?? false
    }
  })

  return (
    <TrendingTags
      className={className}
      tags={formattedTags}
      isSearch={false}
    />
  )
}
