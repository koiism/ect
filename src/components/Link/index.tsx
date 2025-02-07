import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import React from 'react'
import type { Page, Post, Product, City, Category } from '@/payload-types'

type Reference = {
  relationTo: 'pages' | 'posts' | 'products' | 'cities' | 'categories'
  value: Page | Post | Product | City | Category | string | number
}

export type CMSLinkType = {
  type?: 'custom' | 'reference' | null
  newTab?: boolean | null
  reference?: Reference | null
  url?: string | null
  label?: string | null
  appearance?: 'default' | 'outline' | 'inline' | null
  className?: string
  children?: React.ReactNode
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  newTab,
  reference,
  url,
  label,
  appearance = 'default',
  className,
  children,
}) => {
  const href =
    type === 'reference' && typeof reference?.value === 'object' && 'slug' in reference.value
      ? `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${
          reference.value.slug
        }`
      : type === 'reference' && reference
      ? `/${reference.relationTo}/${reference.value}`
      : url

  if (!href) {
    return null
  }

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  if (appearance === 'inline') {
    return (
      <Link
        href={href}
        {...newTabProps}
        className={cn("text-muted-foreground hover:text-foreground", className)}
      >
        {label}
        {children}
      </Link>
    )
  }

  return (
    <Button
      asChild
      variant={appearance}
      className={className}
    >
      <Link href={href} {...newTabProps}>
        {label}
        {children}
      </Link>
    </Button>
  )
}
