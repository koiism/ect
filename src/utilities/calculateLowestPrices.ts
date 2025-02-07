import { Product, ProductOption } from '@/payload-types'

type DateConfig = NonNullable<ProductOption['availableDate']>[number]

export const calculateLowestPrices = (
  selectedTicket: ProductOption | undefined,
  selectedValidDate: DateConfig[] | undefined,
): Record<string, number> => {
  const prices: Record<string, number> = {}

  if (!selectedTicket) return prices

  selectedValidDate?.forEach((dateConfig) => {
    Object.entries(dateConfig.price || {}).forEach(([type, price]) => {
      if (typeof price === 'number' && (!prices[type] || price < prices[type])) {
        prices[type] = price
      }
    })
  })

  return prices
}

export const calculateProductLowestPrice = (product: Product): number => {
  let lowestPrice = Infinity

  const options = product.productOptions as { docs?: ProductOption[] } | undefined
  if (!options?.docs) return 0

  options.docs.forEach((option) => {
    if (!option.availableDate) return

    option.availableDate.forEach((dateConfig) => {
      if (!dateConfig.price || !dateConfig.available) return
      const price = dateConfig.price.Adult
      if (typeof price === 'number' && price < lowestPrice) {
        lowestPrice = price
      }
    })
  })

  return lowestPrice === Infinity ? 0 : lowestPrice
}
