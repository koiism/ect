import { ProductOption } from '@/payload-types'
import { useState, useMemo, useEffect, useCallback } from 'react'
import payloadClient from '@/utilities/payloadClient'
import { OrderStatus } from '@/constants/collections.constants'
import { calculateLowestPrices } from '@/utilities/calculateLowestPrices'

export type CustomerType = NonNullable<ProductOption['applicableCustomers']>[number]

export interface TicketSelection {
  selectedOption: string
  date: Date | undefined
  selectedTime: string
  quantities: Partial<Record<CustomerType, number>>
}

export interface UseTicketSelectionProps {
  productOptions: {
    docs?: ProductOption[]
  }
  value?: TicketSelection
  onChange?: (selection: TicketSelection) => void
}

export const useTicketSelection = ({
  productOptions,
  value,
  onChange,
}: UseTicketSelectionProps) => {
  const [internalSelection, setInternalSelection] = useState<TicketSelection>(() => ({
    selectedOption: productOptions.docs?.length === 1 ? productOptions.docs[0].id : '',
    date: undefined,
    selectedTime: '',
    quantities: {},
  }))

  // 使用受控值或内部状态
  const selection = value ?? internalSelection

  // 统一更新函数
  const updateSelection = (updates: Partial<TicketSelection>) => {
    const newSelection = {
      ...selection,
      ...updates,
    }

    if (onChange) {
      onChange(newSelection)
    } else {
      setInternalSelection(newSelection)
    }
  }

  const selectedTicket = productOptions.docs?.find(
    (option) => option.id === selection.selectedOption,
  )

  const selectedValidDate = useMemo(
    () => selectedTicket?.availableDate.filter((dateConfig) => dateConfig.available),
    [selectedTicket],
  )

  // 日期时间相关逻辑
  const availableTimeRanges = useMemo(() => {
    return (
      selectedValidDate?.find((dateConfig) => {
        if (!selection.date) return false

        const month = (selection.date.getMonth() + 1).toString()
        const day = (selection.date.getDay() || 7).toString()

        return dateConfig.months.includes(month as any) && dateConfig.days.includes(day as any)
      })?.timeRange || []
    )
  }, [selectedValidDate, selection.date])

  useEffect(() => {
    if (availableTimeRanges.length === 1) {
      setInternalSelection((prev) => ({ ...prev, selectedTime: availableTimeRanges[0].time }))
    } else {
      setInternalSelection((prev) => ({ ...prev, selectedTime: '' }))
    }
  }, [availableTimeRanges])

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (!selectedTicket) return true

      const month = (date.getMonth() + 1).toString()
      const day = (date.getDay() || 7).toString()

      const isMonthAvailable = selectedValidDate?.some((dateConfig) =>
        dateConfig.months.includes(month as any),
      )

      const isDayAvailable = selectedValidDate?.some((dateConfig) =>
        dateConfig.days.includes(day as any),
      )

      const isNotPastDate = date >= new Date(new Date().setHours(0, 0, 0, 0))

      return !isMonthAvailable || !isDayAvailable || !isNotPastDate
    },
    [selectedTicket, selectedValidDate],
  )

  // 价格计算相关逻辑
  const selectedDatePrices = useMemo(() => {
    return (
      selectedValidDate?.find((dateConfig) => {
        if (!selection.date) return false

        const month = (selection.date.getMonth() + 1).toString()
        const day = (selection.date.getDay() || 7).toString()

        return dateConfig.months.includes(month as any) && dateConfig.days.includes(day as any)
      })?.price || {}
    )
  }, [selectedValidDate, selection.date])

  const totalPrice = useMemo(() => {
    return Object.entries(selection.quantities).reduce((total, [type, quantity]) => {
      const price = selectedDatePrices[type as keyof typeof selectedDatePrices] || 0
      return total + price * quantity
    }, 0)
  }, [selection.quantities, selectedDatePrices])

  const lowestPrices = useMemo(() => {
    return calculateLowestPrices(selectedTicket, selectedValidDate)
  }, [selectedTicket, selectedValidDate])

  // 客户类型相关逻辑
  const allCustomerTypes = useMemo(() => {
    if (!selectedTicket) return []
    return selectedTicket.applicableCustomers || []
  }, [selectedTicket])

  const handleQuantityChange = (type: CustomerType, action: 'increase' | 'decrease') => {
    const current = selection.quantities[type] || 0
    const newQuantity = action === 'increase' ? current + 1 : Math.max(0, current - 1)

    updateSelection({
      quantities: {
        ...selection.quantities,
        [type]: newQuantity,
      },
    })
  }

  const formattedSelection = useMemo(() => {
    const formatted: TicketSelection = {
      selectedOption: selection.selectedOption,
      date: selection.date,
      selectedTime: selection.selectedTime,
      quantities: {},
    }

    // 只保留有效的票种数量
    Object.entries(selection.quantities).forEach(([type, quantity]) => {
      if (quantity > 0 && selectedTicket?.applicableCustomers?.includes(type as CustomerType)) {
        formatted.quantities[type as CustomerType] = quantity
      }
    })

    // 清理无效的时间选择
    if (!availableTimeRanges.some((range) => range.time === formatted.selectedTime)) {
      formatted.selectedTime = ''
    }

    // 清理无效的日期
    if (formatted.date && isDateDisabled(formatted.date)) {
      formatted.date = undefined
    }

    return formatted
  }, [selection, selectedTicket, availableTimeRanges, isDateDisabled])

  const isValid = useMemo(() => {
    return (
      Object.values(formattedSelection.quantities).some((q) => q > 0) && // 至少选择一个数量
      formattedSelection.selectedOption &&
      formattedSelection.date &&
      (availableTimeRanges.length === 0 || formattedSelection.selectedTime)
    )
  }, [formattedSelection, availableTimeRanges])

  const createOrder = useCallback(async () => {
    if (!selectedTicket?.requiredInfo) return null

    try {
      const { doc: order } = await payloadClient.create({
        collection: 'orders',
        data: {
          status: OrderStatus.PENDING,
          ticket: selectedTicket.id,
          product: selectedTicket.product,
          date: formattedSelection.date?.toISOString() || '',
          time: formattedSelection.selectedTime || '',
          quantity: Object.entries(formattedSelection.quantities).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: value,
            }),
            {},
          ),
        },
      })

      return order.id
    } catch (error) {
      console.error('Failed to create order:', error)
      return null
    }
  }, [selectedTicket, formattedSelection])

  return {
    selection,
    formattedSelection,
    selectedTicket,
    availableTimeRanges,
    selectedDatePrices,
    totalPrice,
    lowestPrices,
    allCustomerTypes,
    isDateDisabled,
    updateSelection,
    handleQuantityChange,
    isValid,
    createOrder,
  }
}
