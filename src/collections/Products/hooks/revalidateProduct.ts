import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Product } from '../../../payload-types'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = doc.slug

    payload.logger.info(`Revalidating product at path: ${path}`)

    revalidatePath(path)
    revalidateTag('products-sitemap')
  }

  // If the product was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug

    payload.logger.info(`Revalidating old product at path: ${oldPath}`)

    revalidatePath(oldPath)
    revalidateTag('products-sitemap')
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Product> = ({ doc }) => {
  const path = doc?.slug
  revalidatePath(path)
  revalidateTag('products-sitemap')

  return doc
}
