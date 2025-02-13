import { create } from 'zustand'
import { ProductOption } from '@/payload-types'
import { OrderStatus } from '@/constants/collections.constants'
import payloadClient from '@/utilities/payloadClient'
import { calculateLowestPrices } from '@/utilities/calculateLowestPrices'

export type CustomerType = NonNullable<ProductOption['applicableCustomers']>[number]

interface TicketState {
  selectedOption: string
  date: Date | undefined
  selectedTime: string
  quantities: Partial<Record<CustomerType, number>>
  isLoading: boolean
  productOptions: ProductOption[] | undefined
}

interface TicketActions {
  initialize: (options: ProductOption[]) => void
  selectOption: (option: string) => void
  selectDate: (date: Date | undefined) => void
  selectTime: (time: string) => void
  updateQuantity: (type: CustomerType, value: number) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useTicketStore = create<TicketState & TicketActions>((set, get) => ({
  // Base state
  selectedOption: '',
  date: undefined,
  selectedTime: '',
  quantities: {},
  isLoading: false,
  productOptions: undefined,

  // Actions
  initialize: (options) => {
    const selectedOption = options.length === 1 ? options[0].id : ''
    set({
      productOptions: options,
      selectedOption,
    })
  },

  selectOption: (option) => set({ selectedOption: option }),

  selectDate: (date) => set({ date }),

  selectTime: (time) => set({ selectedTime: time }),

  updateQuantity: (type, value) =>
    set((state) => ({
      quantities: {
        ...state.quantities,
        [type]: value,
      },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () =>
    set({
      selectedOption: '',
      date: undefined,
      selectedTime: '',
      quantities: {},
      isLoading: false,
    }),
}))

// Selectors
const selectedTicketSelector = (state: TicketState) =>
  state.productOptions?.find((option) => option.id === state.selectedOption)

const selectedValidDateSelector = (state: TicketState) => {
  const selectedTicket = selectedTicketSelector(state)
  return selectedTicket?.availableDate.filter((dateConfig) => dateConfig.available)
}

const availableTimeRangesSelector = (state: TicketState) => {
  const selectedValidDate = selectedValidDateSelector(state)
  if (!state.date || !selectedValidDate) return []

  const month = (state.date.getMonth() + 1).toString()
  const day = (state.date.getDay() || 7).toString()

  const matchingDate = selectedValidDate.find(
    (dateConfig) =>
      dateConfig.months.includes(month as any) && dateConfig.days.includes(day as any),
  )

  return matchingDate?.timeRange?.map((range) => ({
    id: range.id || null,
    time: range.time,
  })) || []
}

const selectedDatePricesSelector = (state: TicketState) => {
  const selectedValidDate = selectedValidDateSelector(state)
  if (!state.date || !selectedValidDate) return {}

  const month = (state.date.getMonth() + 1).toString()
  const day = (state.date.getDay() || 7).toString()

  const matchingDate = selectedValidDate.find(
    (dateConfig) =>
      dateConfig.months.includes(month as any) && dateConfig.days.includes(day as any),
  )

  if (!matchingDate?.price) return {}

  const validPrices: Partial<Record<CustomerType, number>> = {}
  Object.entries(matchingDate.price).forEach(([key, value]) => {
    if (typeof value === 'number') {
      validPrices[key as CustomerType] = value
    }
  })
  return validPrices
}

const totalPriceSelector = (state: TicketState) => {
  const selectedDatePrices = selectedDatePricesSelector(state)
  return Object.entries(state.quantities).reduce((total, [type, quantity]) => {
    const price = selectedDatePrices[type as CustomerType] || 0
    return total + price * (quantity || 0)
  }, 0)
}

const lowestPricesSelector = (state: TicketState) => {
  const selectedTicket = selectedTicketSelector(state)
  const selectedValidDate = selectedValidDateSelector(state)
  return calculateLowestPrices(selectedTicket, selectedValidDate)
}

const allCustomerTypesSelector = (state: TicketState) =>
  selectedTicketSelector(state)?.applicableCustomers || []

const isValidSelector = (state: TicketState) => {
  const availableTimeRanges = availableTimeRangesSelector(state)
  const totalQuantity = Object.values(state.quantities).reduce(
    (sum, quantity) => sum + (quantity || 0),
    0,
  )

  return Boolean(
    state.selectedOption &&
      state.date &&
      totalQuantity > 0 &&
      (availableTimeRanges.length === 0 || state.selectedTime),
  )
}

const statusMessageSelector = (state: TicketState) => {
  const selectedTicket = selectedTicketSelector(state)
  const availableTimeRanges = availableTimeRangesSelector(state)
  const totalQuantity = Object.values(state.quantities).reduce(
    (sum, quantity) => sum + (quantity || 0),
    0,
  )

  if (!selectedTicket) return 'Please select a ticket type'
  if (!state.date) return 'Please select a date'
  if (availableTimeRanges.length > 0 && !state.selectedTime) return 'Please select a time range'
  if (totalQuantity === 0) return 'Please select at least one visitor'
  return null
}

const isDateDisabledSelector = (state: TicketState) => (date: Date) => {
  const selectedTicket = selectedTicketSelector(state)
  const selectedValidDate = selectedTicket?.availableDate.filter(
    (dateConfig) => dateConfig.available,
  )

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
}

// Export hooks for accessing state
export const useSelectedTicket = () => useTicketStore(selectedTicketSelector)
export const useAvailableTimeRanges = () => useTicketStore(availableTimeRangesSelector)
export const useSelectedDatePrices = () => useTicketStore(selectedDatePricesSelector)
export const useTotalPrice = () => useTicketStore(totalPriceSelector)
export const useLowestPrices = () => useTicketStore(lowestPricesSelector)
export const useAllCustomerTypes = () => useTicketStore(allCustomerTypesSelector)
export const useIsValid = () => useTicketStore(isValidSelector)
export const useStatusMessage = () => useTicketStore(statusMessageSelector)
export const useIsDateDisabled = () => useTicketStore(isDateDisabledSelector)

export const createOrder = async () => {
  const state = useTicketStore.getState()
  const selectedTicket = selectedTicketSelector(state)

  if (!selectedTicket?.requiredInfo) return null

  try {
    const { doc: order } = await payloadClient.create({
      collection: 'orders',
      data: {
        status: OrderStatus.PENDING,
        ticket: selectedTicket.id,
        product: selectedTicket.product,
        date: state.date?.toISOString() || '',
        time: state.selectedTime || '',
        quantity: Object.entries(state.quantities).reduce(
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
}
