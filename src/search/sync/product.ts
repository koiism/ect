import type { BeforeSync } from '@payloadcms/plugin-search/types'
import { baseBeforeSync } from './base'

export const productBeforeSync: BeforeSync = async (args) => {
  const baseDoc = baseBeforeSync(args)
  const { originalDoc } = args

  // 获取city关系数据
  let cityData: {
    title: string | null
    themeColor: string | null
  } = {
    title: null,
    themeColor: null,
  }

  if (originalDoc.city) {
    cityData = {
      title: originalDoc.city.title,
      themeColor: originalDoc.city.themeColor,
    }
  }

  // 获取第一张图片的信息
  let imageData = {
    url: null,
    alt: null,
  }
  if (originalDoc.images && originalDoc.images.length > 0) {
    const firstImage = originalDoc.images[0]
    if (firstImage) {
      imageData = {
        url: firstImage.url,
        alt: firstImage.alt || null,
      }
    }
  }

  return {
    ...baseDoc,
    collectionLabel: 'products',
    title: originalDoc.title,
    summary: originalDoc.summary,
    lowestPrice: originalDoc.lowestPrice,
    city: cityData,
    image: imageData,
    slug: originalDoc.slug,
    aboutThisTour: {
      cancellation: originalDoc.aboutThisTour.cancellation,
      duration: originalDoc.aboutThisTour.duration,
      disabledFriendly: originalDoc.aboutThisTour.disabledFriendly || false,
      skipTicketLine: originalDoc.aboutThisTour.skipTicketLine || false,
    },
  }
}
