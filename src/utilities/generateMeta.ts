import type { Metadata } from 'next'
import type { Media, Page, Post, Product, City, Config, Category, User } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

type DocWithMeta = {
  meta?: {
    title?: string | null
    description?: string | null
    image?: Media | string | null
    keywords?: string[] | null
  }
  title?: string | null
  slug?: string | string[] | null
}

type ExtendedMetadata = Metadata & {
  publishedTime?: string
  modifiedTime?: string
}

type ExtendedOpenGraph = Metadata['openGraph'] & {
  [key: string]: any
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()
  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

const getDocType = (doc: any): 'page' | 'post' | 'product' | 'city' => {
  if ('productOptions' in doc) return 'product'
  if ('content' in doc && 'relatedPosts' in doc) return 'post'
  if ('attractions' in doc) return 'city'
  return 'page'
}

export const generateMeta = async (args: {
  doc: (Partial<Page> | Partial<Post> | Partial<Product> | Partial<City>) & DocWithMeta
}): Promise<ExtendedMetadata> => {
  const { doc } = args || {}
  if (!doc) return {}

  const docType = getDocType(doc)
  const ogImage = getImageURL(doc?.meta?.image)
  const baseTitle = doc?.meta?.title || doc?.title || ''
  const baseDescription = doc?.meta?.description || ''

  // 基础metadata
  const metadata: ExtendedMetadata = {
    title: baseTitle ? `${baseTitle} | Explore China Tour` : 'Explore China Tour',
    description: baseDescription,
    keywords: doc?.meta?.keywords || [],
  }

  // OpenGraph配置
  const openGraphBase = {
    title: baseTitle,
    description: baseDescription,
    images: ogImage
      ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: baseTitle,
          },
        ]
      : undefined,
    url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
  }

  // 根据文档类型添加特定的metadata
  switch (docType) {
    case 'product':
      const product = doc as Partial<Product>
      metadata.openGraph = mergeOpenGraph({
        ...openGraphBase,
        type: 'website',
        custom: {
          price: product.lowestPrice?.toString(),
          currency: 'USD',
        },
      } as ExtendedOpenGraph)
      break

    case 'post':
      const post = doc as Partial<Post>
      const categories = (post.categories as Category[]) || []
      const authors = (post.authors as User[]) || []
      metadata.openGraph = mergeOpenGraph({
        ...openGraphBase,
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: authors.map(author => author.name || ''),
        section: categories[0]?.title || '',
        tags: categories.map(cat => cat.title || ''),
      } as ExtendedOpenGraph)
      metadata.authors = authors.map(author => ({ name: author.name || '' }))
      metadata.publishedTime = post.createdAt
      metadata.modifiedTime = post.updatedAt
      break

    case 'city':
      metadata.openGraph = mergeOpenGraph({
        ...openGraphBase,
        type: 'website',
        custom: {
          themeColor: (doc as Partial<City>).themeColor,
        },
      } as ExtendedOpenGraph)
      break

    default:
      metadata.openGraph = mergeOpenGraph(openGraphBase)
  }

  return metadata
}
