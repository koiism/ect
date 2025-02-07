import { Category, City, Page, Post, Product } from '@/payload-types'

type Link = {
  type?: ('reference' | 'custom') | null
  newTab?: boolean | null
  reference?:
    | ({
        relationTo: 'pages'
        value: string | Page
      } | null)
    | ({
        relationTo: 'posts'
        value: string | Post
      } | null)
    | ({
        relationTo: 'products'
        value: string | Product
      } | null)
    | ({
        relationTo: 'cities'
        value: string | City
      } | null)
    | ({
        relationTo: 'categories'
        value: string | Category
      } | null)
  url?: string | null
  label?: string
  /**
   * 选择链接的样式
   */
  appearance?: ('default' | 'outline') | null
}

export const getLinkPath = (link?: Link | string) => {
  if (!link || typeof link === 'string') return ''

  if (link.type === 'custom') {
    return link.url ?? ''
  }

  const slug = (link.reference?.value as any).slug

  if (link.reference?.relationTo && slug) {
    return `/${link.reference.relationTo}/${slug}`
  }

  return ''
}
