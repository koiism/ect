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

  // Derived state
  selectedTicket: ProductOption | undefined
  availableTimeRanges: Array<{ id: string | null; time: string }>
  selectedDatePrices: Partial<Record<CustomerType, number>>
  totalPrice: number
  lowestPrices: Partial<Record<CustomerType, number>>
  allCustomerTypes: CustomerType[]
  isValid: boolean
  statusMessage: string | null
}

interface TicketActions {
  initialize: (options: ProductOption[]) => void
  selectOption: (option: string) => void
  selectDate: (date: Date | undefined) => void
  selectTime: (time: string) => void
  updateQuantity: (type: CustomerType, value: number) => void
  setLoading: (loading: boolean) => void
  reset: () => void
  isDateDisabled: (date: Date) => boolean
}

const calculateDerivedState = (state: Omit<TicketState, keyof Omit<TicketState, 'selectedOption' | 'date' | 'selectedTime' | 'quantities' | 'isLoading' | 'productOptions'>>) => {
  const selectedTicket = state.productOptions?.find(option => option.id === state.selectedOption)
  const selectedValidDate = selectedTicket?.availableDate.filter(
    dateConfig => dateConfig.available
  )

  let availableTimeRanges: Array<{ id: string | null; time: string }> = []
  let selectedDatePrices: Partial<Record<CustomerType, number>> = {}

  if (state.date && selectedValidDate) {
    const month = (state.date.getMonth() + 1).toString()
    const day = (state.date.getDay() || 7).toString()

    const matchingDate = selectedValidDate.find(dateConfig =>
      dateConfig.months.includes(month as any) &&
      dateConfig.days.includes(day as any)
    )

    if (matchingDate?.timeRange) {
      availableTimeRanges = matchingDate.timeRange.map((range) => ({
        id: range.id || null,
        time: range.time,
      }))
    }

    if (matchingDate?.price) {
      const validPrices: Partial<Record<CustomerType, number>> = {}
      Object.entries(matchingDate.price).forEach(([key, value]) => {
        if (typeof value === 'number') {
          validPrices[key as CustomerType] = value
        }
      })
      selectedDatePrices = validPrices
    }
  }

  const totalPrice = Object.entries(state.quantities).reduce((total, [type, quantity]) => {
    const price = selectedDatePrices[type as CustomerType] || 0
    return total + price * (quantity || 0)
  }, 0)

  const lowestPrices = calculateLowestPrices(selectedTicket, selectedValidDate)

  const allCustomerTypes = selectedTicket?.applicableCustomers || []

  const totalQuantity = Object.values(state.quantities).reduce(
    (sum, quantity) => sum + (quantity || 0),
    0
  )

  const isValid = Boolean(
    state.selectedOption &&
    state.date &&
    totalQuantity > 0 &&
    (availableTimeRanges.length === 0 || state.selectedTime)
  )

  let statusMessage: string | null = null
  if (!selectedTicket) {
    statusMessage = 'Please select a ticket type'
  } else if (!state.date) {
    statusMessage = 'Please select a date'
  } else if (availableTimeRanges.length > 0 && !state.selectedTime) {
    statusMessage = 'Please select a time range'
  } else if (totalQuantity === 0) {
    statusMessage = 'Please select at least one visitor'
  }

  return {
    selectedTicket,
    availableTimeRanges,
    selectedDatePrices,
    totalPrice,
    lowestPrices,
    allCustomerTypes,
    isValid,
    statusMessage,
  }
}

export const useTicketStore = create<TicketState & TicketActions>((set, get) => ({
  // Base state
  selectedOption: '',
  date: undefined,
  selectedTime: '',
  quantities: {},
  isLoading: false,
  productOptions: undefined,

  // Derived state (initial values)
  selectedTicket: undefined,
  availableTimeRanges: [],
  selectedDatePrices: {},
  totalPrice: 0,
  lowestPrices: {},
  allCustomerTypes: [],
  isValid: false,
  statusMessage: null,

  // Actions
  initialize: (options) => {
    const selectedOption = options.length === 1 ? options[0].id : ''
    set({
      productOptions: options,
      selectedOption,
      ...calculateDerivedState({
        selectedOption,
        date: undefined,
        selectedTime: '',
        quantities: {},
        isLoading: false,
        productOptions: options,
      }),
    })
  },

  selectOption: (option) => set((state) => ({
    selectedOption: option,
    ...calculateDerivedState({ ...state, selectedOption: option }),
  })),

  selectDate: (date) => set((state) => ({
    date,
    ...calculateDerivedState({ ...state, date }),
  })),

  selectTime: (time) => set((state) => ({
    selectedTime: time,
    ...calculateDerivedState({ ...state, selectedTime: time }),
  })),

  updateQuantity: (type, value) => set((state) => {
    const newQuantities = {
      ...state.quantities,
      [type]: value,
    }
    return {
      quantities: newQuantities,
      ...calculateDerivedState({ ...state, quantities: newQuantities }),
    }
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () => set((state) => ({
    selectedOption: '',
    date: undefined,
    selectedTime: '',
    quantities: {},
    isLoading: false,
    ...calculateDerivedState({
      selectedOption: '',
      date: undefined,
      selectedTime: '',
      quantities: {},
      isLoading: false,
      productOptions: state.productOptions,
    }),
  })),

  isDateDisabled: (date: Date) => {
    const state = get()
    const selectedTicket = state.selectedTicket
    const selectedValidDate = selectedTicket?.availableDate.filter(
      dateConfig => dateConfig.available
    )

    if (!selectedTicket) return true

    const month = (date.getMonth() + 1).toString()
    const day = (date.getDay() || 7).toString()

    const isMonthAvailable = selectedValidDate?.some(dateConfig =>
      dateConfig.months.includes(month as any)
    )

    const isDayAvailable = selectedValidDate?.some(dateConfig =>
      dateConfig.days.includes(day as any)
    )

    const isNotPastDate = date >= new Date(new Date().setHours(0, 0, 0, 0))

    return !isMonthAvailable || !isDayAvailable || !isNotPastDate
  },
}))

// Export hooks for accessing state
export const useSelectedTicket = () => useTicketStore((state) => state.selectedTicket)
export const useAvailableTimeRanges = () => useTicketStore((state) => state.availableTimeRanges)
export const useSelectedDatePrices = () => useTicketStore((state) => state.selectedDatePrices)
export const useTotalPrice = () => useTicketStore((state) => state.totalPrice)
export const useLowestPrices = () => useTicketStore((state) => state.lowestPrices)
export const useAllCustomerTypes = () => useTicketStore((state) => state.allCustomerTypes)
export const useIsDateDisabled = () => useTicketStore((state) => state.isDateDisabled)
export const useIsValid = () => useTicketStore((state) => state.isValid)
export const useStatusMessage = () => useTicketStore((state) => state.statusMessage)

export const createOrder = async () => {
  const state = useTicketStore.getState()
  const selectedTicket = state.selectedTicket

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
