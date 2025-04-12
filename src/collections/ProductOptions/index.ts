import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { ProductOption } from '@/payload-types'
import { calculateProductLowestPrice } from '@/utilities/calculateLowestPrices'
import {
  CustomerType,
  customerTypeLabels,
  months,
  defaultMonths,
  days,
  defaultDays,
  applicableCustomers,
} from '@/constants/collections.constants'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { revalidateDelete, revalidateProductOption } from './hooks/revalidateProductOptions'

const formatNumberRange = (numbers: string[]): string[] => {
  const nums = numbers.map(Number).sort((a, b) => a - b)
  const ranges: string[] = []
  let start = nums[0]
  let prev = start

  for (let i = 1; i <= nums.length; i++) {
    if (i === nums.length || nums[i] !== prev + 1) {
      ranges.push(start === prev ? String(start) : `${start}-${prev}`)
      if (i < nums.length) {
        start = nums[i]
        prev = start
      }
    } else {
      prev = nums[i]
    }
  }

  return ranges
}

const formatMonths = (months: string[]): string => {
  return formatNumberRange(months)
    .map((range) => `${range}月`)
    .join('、')
}

const formatDays = (days: string[]): string => {
  return formatNumberRange(days)
    .map((range) => `星期${range}`)
    .join('、')
}

const getOverlappingItems = (arr1: string[], arr2: string[]): string[] => {
  return arr1.filter((item) => arr2.includes(item))
}

interface DateConfig {
  months: string[]
  days: string[]
}

const checkDateCoverage = (value: unknown[] | null | undefined): string | true => {
  if (!value || !Array.isArray(value)) return true

  // 创建一个映射来跟踪每个月份的每个星期的覆盖情况
  const coverage: Record<string, Set<string>> = {}
  months.forEach((month) => {
    coverage[month.value] = new Set()
  })

  // 遍历所有配置，记录已覆盖的日期
  value.forEach((config: any) => {
    const { months: configMonths, days: configDays } = config as DateConfig
    configMonths.forEach((month: string) => {
      configDays.forEach((day: string) => {
        coverage[month].add(day)
      })
    })
  })

  // 检查未完全覆盖的情况
  const uncovered: { month: string[]; days: string[] }[] = []
  const monthGroups: Record<string, string[]> = {}

  Object.entries(coverage).forEach(([month, coveredDays]) => {
    const dayValues = days.map((d) => d.value)
    const missingDays = dayValues.filter((day) => !coveredDays.has(day))
    if (missingDays.length > 0) {
      // 按照缺失的天数对月份进行分组
      const daysKey = missingDays.sort().join(',')
      if (!monthGroups[daysKey]) {
        monthGroups[daysKey] = []
      }
      monthGroups[daysKey].push(month)
    }
  })

  // 将分组后的结果转换为uncovered数组
  Object.entries(monthGroups).forEach(([daysKey, monthList]) => {
    uncovered.push({
      month: monthList,
      days: daysKey.split(','),
    })
  })

  if (uncovered.length > 0) {
    const uncoveredText = uncovered
      .map(({ month, days }) => {
        return `[${formatMonths(month)}] 的 [${formatDays(days)}]`
      })
      .join('；')
    return `以下时间未被覆盖：${uncoveredText}`
  }

  return true
}

const validateAvailableDates = (value: unknown[] | null | undefined): string | true => {
  // 首先检查重叠
  const overlapResult = validateDateOverlap(value)
  if (typeof overlapResult === 'string') {
    return overlapResult
  }

  // 然后检查覆盖完整性
  return checkDateCoverage(value)
}

const validateDateOverlap = (value: unknown[] | null | undefined): string | true => {
  if (!value || !Array.isArray(value)) return true

  for (let i = 0; i < value.length; i++) {
    for (let j = i + 1; j < value.length; j++) {
      const date1 = value[i] as DateConfig
      const date2 = value[j] as DateConfig

      const overlappingMonths = getOverlappingItems(date1.months, date2.months)
      const overlappingDays = getOverlappingItems(date1.days, date2.days)

      if (overlappingMonths.length > 0 && overlappingDays.length > 0) {
        return `第${i + 1}项配置与第${j + 1}项配置在 [${formatMonths(
          overlappingMonths,
        )}] 的 [${formatDays(overlappingDays)}] 存在重叠，请调整配置`
      }
    }
  }
  return true
}

export const ProductOptions: CollectionConfig = {
  slug: 'product-options',
  admin: {
    useAsTitle: 'useAsTitle',
    defaultColumns: ['useAsTitle', 'price', 'updatedAt'],
    group: '业务数据',
  },
  labels: {
    singular: '产品选项',
    plural: '产品选项',
  },
  hooks: {
    afterChange: [revalidateProductOption],
    afterDelete: [revalidateDelete],
  },
  defaultPopulate: {
    title: true,
    availableDate: true,
    applicableCustomers: true,
    summary: true,
    requiredInfo: true,
    product: true,
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      name: 'useAsTitle',
      label: '标题',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            const { product, title } = data as ProductOption
            if (product) {
              const productData = await req.payload.findByID({
                collection: 'products',
                id: product as string,
              })
              return `${productData.title} - ${title}`
            }
            return ''
          },
        ],
      },
    },
    {
      name: 'product',
      required: true,
      type: 'relationship',
      relationTo: 'products',
      label: '产品',
    },
    {
      name: 'title',
      type: 'text',
      label: '标题',
      required: true,
      localized: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      label: '摘要',
      localized: true,
    },
    {
      type: 'tabs',
      label: '描述',
      tabs: [
        {
          label: '价格信息',
          fields: [
            {
              name: 'applicableCustomers',
              label: '适用人群',
              type: 'select',
              hasMany: true,
              options: applicableCustomers,
              defaultValue: ['Adult'],
            },
            {
              name: 'requiredInfo',
              type: 'relationship',
              relationTo: 'order-fields',
              label: '所需信息表单',
              hasMany: true,
              admin: {
                description: '选择预订该产品时需要填写的表单',
              },
            },
            {
              name: 'availableDate',
              type: 'array',
              label: '可用日期配置',
              required: true,
              validate: (value) => validateAvailableDates(value),
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'months',
                      type: 'select',
                      hasMany: true,
                      required: true,
                      label: '月份',
                      options: months,
                      defaultValue: defaultMonths,
                      admin: {
                        description: '选择适用的月份',
                      },
                    },
                    {
                      name: 'days',
                      type: 'select',
                      hasMany: true,
                      required: true,
                      label: '星期',
                      options: days,
                      defaultValue: defaultDays,
                      admin: {
                        description: '选择适用的星期',
                      },
                    },
                    {
                      type: 'checkbox',
                      name: 'available',
                      label: '可用',
                      defaultValue: true,
                    },
                  ],
                },
                {
                  name: 'timeRange',
                  type: 'array',
                  label: '时间段',
                  fields: [
                    {
                      name: 'time',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                  admin: {
                    description: '添加可选的时间段，如"8:00AM~12:00PM"',
                  },
                },
                {
                  name: 'price',
                  type: 'group',
                  label: '价格',
                  fields: Object.values(CustomerType).map((type) => ({
                    name: type,
                    type: 'number',
                    label: customerTypeLabels[type],
                    required: true,
                    localized: true,
                    admin: {
                      condition: (data) => data?.applicableCustomers?.includes(type),
                    },
                  })),
                },
              ],
              admin: {
                description: '配置不同时期的可用时间',
              },
            },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: true,
  },
}
