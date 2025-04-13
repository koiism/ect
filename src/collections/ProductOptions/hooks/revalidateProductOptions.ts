import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

import type { ProductOption } from '../../../payload-types'
import { calculateProductLowestPrice } from '@/utilities/calculateLowestPrices'
import { revalidatePath } from 'next/cache'

const updateLowestPrice = async (productId: string, req: PayloadRequest) => {

  if (productId) {
    // 获取产品及其所有选项
    const productData = await req.payload.findByID({
      collection: 'products',
      id: productId,
      depth: 1,
    })
    const path = `/products/${productData.slug}`
    console.warn(`Revalidating path: ${path}`)
    revalidatePath(path)

    // 计算最低价格
    const lowestPrice = calculateProductLowestPrice(productData)

    // 更新产品的最低价格
    await req.payload.update({
      collection: 'products',
      id: productId,
      data: {
        lowestPrice,
      },
    })
  }
}

export const revalidateProductOption: CollectionAfterChangeHook<ProductOption> = async ({
  doc,
  req,
}) => {
  const { product } = doc
  if (product) {
    updateLowestPrice(product as string, req)
  }
}

export const revalidateDelete: CollectionAfterDeleteHook<ProductOption> = async ({
  doc,
  req,
}) => {
  const { product } = doc
  if (product) {
    updateLowestPrice(product as string, req)
  }
}
