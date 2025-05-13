import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { findValidOption, isDateValidInProductOptions } from '@/utilities/productOptionsUtils'
import { formatInTimeZone } from 'date-fns-tz'
import { toBeijingTime } from '@/utilities/timezone'
import {
  CustomerType,
  CustomerType2GYGCategoriesMap,
  GYGCategory,
} from '@/constants/collections.constants'

export interface Availability {
  dateTime?: string
  openingTimes?: OpeningTime[]
  productId: string
  cutoffSeconds: number
  vacancies: number
  currency: string
  pricesByCategory: PricesByCategory
}

export interface OpeningTime {
  fromTime: string
  toTime: string
}

export interface PricesByCategory {
  retailPrices: RetailPrice[]
}

export interface RetailPrice {
  category: string
  price: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const fromDateTime = searchParams.get('fromDateTime')
    const toDateTime = searchParams.get('toDateTime')

    if (!productId || !fromDateTime || !toDateTime) {
      return NextResponse.json(
        {
          errorCode: 'INVALID_PARAMETERS',
          errorMessage: 'Missing required parameters',
        },
        { status: 400 },
      )
    }

    const payloadClient = await getPayload({ config: payloadConfig })

    // 获取产品选项
    const productOption = await payloadClient.find({
      collection: 'product-options',
      where: {
        id: {
          equals: productId,
        },
      },
    })

    if (!productOption.docs.length) {
      return NextResponse.json(
        {
          errorCode: 'INVALID_PRODUCT',
          errorMessage: 'Invalid productId',
        },
        { status: 400 },
      )
    }

    const option = productOption.docs[0]
    const availabilities: Availability[] = []

    // 解析日期范围
    const fromDate = new Date(fromDateTime)
    const toDate = new Date(toDateTime)

    const queryDates = Array.from(
      { length: Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) },
      (_, i) => {
        const date = new Date(fromDate.getTime() + i * 24 * 60 * 60 * 1000)
        return formatInTimeZone(date, 'Asia/Shanghai', 'yyyy-MM-dd')
      },
    )

    const availableDates = queryDates.filter((date) => {
      return isDateValidInProductOptions(toBeijingTime(date), option)
    })

    availableDates.forEach((date) => {
      const validOption = findValidOption(toBeijingTime(date), option)
      const availability: Availability = {
        productId: productId,
        cutoffSeconds: option.cutoffSeconds || 0,
        vacancies: validOption?.vacancies || 9999,
        currency: 'USD',
        pricesByCategory: {
          retailPrices: Object.keys(validOption?.price || {}).map((category) => ({
            category: CustomerType2GYGCategoriesMap[category as CustomerType],
            price: validOption?.price?.[category as CustomerType] || 0,
          })),
        },
      }
      validOption?.timeRange?.forEach((timeRange, index, timeRanges) => {
        const to = timeRange.toTime
        if (to) {
          availability.dateTime = toBeijingTime(date).toISOString()
          if (!availability.openingTimes) {
            availability.openingTimes = []
          }
          availability.openingTimes.push({
            fromTime: timeRange.fromTime,
            toTime: to,
          })
          if (index === timeRanges.length - 1) {
            availabilities.push(availability)
          }
        } else {
          availability.dateTime = toBeijingTime(`${date} ${timeRange.fromTime}`).toISOString()
          availabilities.push(availability)
        }
      })
    })

    return NextResponse.json({
      data: {
        availabilities,
      },
    })
  } catch (error) {
    console.error('Error getting availabilities:', error)
    return NextResponse.json(
      {
        errorCode: 'INTERNAL_SYSTEM_FAILURE',
        errorMessage: 'Internal server error',
      },
      { status: 500 },
    )
  }
}
