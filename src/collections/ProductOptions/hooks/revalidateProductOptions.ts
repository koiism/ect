import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

import type { ProductOption } from '../../../payload-types'
import { calculateProductLowestPrice } from '@/utilities/calculateLowestPrices'
import { revalidatePath } from 'next/cache'
import { ProductOptions } from '..'

const updateLowestPrice = async (
  productId: string,
  req: PayloadRequest,
  currentOption: ProductOption,
) => {
  if (productId) {
    // 获取产品及其所有选项
    const productData = await req.payload.findByID({
      collection: 'products',
      id: productId,
      depth: 1,
    })

    const newProductOptions: ProductOption[] = [
      ...((productData?.productOptions?.docs as ProductOption[]) || []).filter(
        (option) => option.id !== currentOption.id,
      ),
      currentOption,
    ]

    const newProductData = {
      ...productData,
      productOptions: {
        ...productData.productOptions,
        docs: newProductOptions,
      },
    }

    // 计算最低价格
    const lowestPrice = calculateProductLowestPrice(newProductData)

    // 更新产品的最低价格
    await req.payload.update({
      collection: 'products',
      id: productId,
      data: {
        lowestPrice,
      },
    })

    const path = `/products/${productData.slug}`
    revalidatePath(path)
  }
}

export const revalidateProductOption: CollectionAfterChangeHook<ProductOption> = async ({
  doc,
  req,
}) => {
  const { product } = doc
  if (product) {
    // 添加 await 确保异步操作完成
    await updateLowestPrice(product as string, req, doc)
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<ProductOption> = async ({ doc, req }) => {
  const { product } = doc
  if (product) {
    // 添加 await 确保异步操作完成
    await updateLowestPrice(product as string, req, doc)
  }
  return doc
}
