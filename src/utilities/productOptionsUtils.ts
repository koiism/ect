import { ProductOption } from '@/payload-types'
import { today } from './timezone'

export const isDateValidInProductOptions = (date: Date, productOptions: ProductOption) => {
  const month = (date.getMonth() + 1).toString()
  const day = (date.getDay() || 7).toString()
  const availableDateConfig = productOptions?.availableDate.filter(
    (dateConfig) => dateConfig.available,
  )

  const isMonthAvailable = availableDateConfig?.some((dateConfig) =>
    dateConfig.months.includes(month as any),
  )

  const isDayAvailable = availableDateConfig?.some((dateConfig) =>
    dateConfig.days.includes(day as any),
  )

  const isNotPastDate = date >= today()

  return isMonthAvailable && isDayAvailable && isNotPastDate
}

export const findValidOption = (date: Date, productOptions: ProductOption) => {
  return productOptions?.availableDate.find((dateConfig) => {
    const isMonthAvailable = dateConfig.months.includes((date.getMonth() + 1).toString() as any)
    const isDayAvailable = dateConfig.days.includes((date.getDay() || 7).toString() as any)
    const isNotPastDate = date >= today()

    return isMonthAvailable && isDayAvailable && isNotPastDate
  })
}
