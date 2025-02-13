'use client'

import { ProductOption } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useRouter } from 'next/navigation'
import { CustomerTypeQuantity } from './CustomerTypeQuantity'
import { useState, useEffect, memo } from 'react'
import { Tracker } from '@/tracking'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  useTicketStore,
  useSelectedTicket,
  useAvailableTimeRanges,
  useSelectedDatePrices,
  useTotalPrice,
  useLowestPrices,
  useAllCustomerTypes,
  useIsDateDisabled,
  useIsValid,
  useStatusMessage,
  createOrder,
  CustomerType,
} from '@/stores/ticketStore'

// 抽离状态消息组件
const StatusMessage = memo(({ message }: { message: string | null }) => {
  if (!message) return null
  return <div className="text-sm text-muted-foreground">{message}</div>
})
StatusMessage.displayName = 'StatusMessage'

// 抽离总价组件
const TotalPrice = memo(({ price }: { price: number }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm font-medium">Total:</span>
    <span className="text-lg font-semibold">${price}</span>
  </div>
))
TotalPrice.displayName = 'TotalPrice'

// 抽离提交按钮组件
const SubmitButton = memo(
  ({
    isValid,
    isLoading,
    onClick,
  }: {
    isValid: boolean
    isLoading: boolean
    onClick: () => void
  }) => (
    <Tracker
      click={{
        buttonClick: {
          buttonName: 'check_availability',
        },
      }}
    >
      <Button className="w-full" size="lg" disabled={!isValid || isLoading} onClick={onClick}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          'Check Availability'
        )}
      </Button>
    </Tracker>
  ),
)
SubmitButton.displayName = 'SubmitButton'

// 抽离日期选择器组件
const DatePicker = memo(
  ({
    date,
    onSelect,
    isDisabled,
  }: {
    date: Date | undefined
    onSelect: (date: Date | undefined) => void
    isDisabled: (date: Date) => boolean
  }) => (
    <Calendar
      mode="single"
      selected={date}
      onSelect={onSelect}
      disabled={isDisabled}
      className="mx-auto"
    />
  ),
)
DatePicker.displayName = 'DatePicker'

interface TicketCardProps {
  productOptions: {
    docs?: ProductOption[]
  }
}

export function TicketCard({ productOptions }: TicketCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    selectedOption,
    date,
    selectedTime,
    quantities,
    selectOption,
    selectDate,
    selectTime,
    updateQuantity,
  } = useTicketStore()

  const selectedTicket = useSelectedTicket()
  const availableTimeRanges = useAvailableTimeRanges()
  const selectedDatePrices = useSelectedDatePrices()
  const totalPrice = useTotalPrice()
  const lowestPrices = useLowestPrices()
  const allCustomerTypes = useAllCustomerTypes()
  const isDateDisabled = useIsDateDisabled()
  const isValid = useIsValid()
  const statusMessage = useStatusMessage()

  useEffect(() => {
    if (productOptions.docs) {
      useTicketStore.getState().initialize(productOptions.docs)
    }
  }, [productOptions.docs])

  const handleCheckAvailability = async () => {
    try {
      setIsLoading(true)
      const orderId = await createOrder()
      if (orderId) {
        router.push(`/checkout?orderId=${orderId}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (type: CustomerType, action: 'increase' | 'decrease') => {
    const current = quantities[type] || 0
    const newQuantity = action === 'increase' ? current + 1 : Math.max(0, current - 1)
    updateQuantity(type, newQuantity)
  }

  const shouldShowTotal = Boolean(
    selectedTicket &&
      date &&
      Object.values(quantities).some((quantity) => (quantity ?? 0) > 0),
  )

  const timeRangeOptions = availableTimeRanges.map((timeRange) => ({
    id: timeRange.id,
    time: timeRange.time,
    isSelected: selectedTime === timeRange.time,
  }))

  const renderMobileContent = () => (
    <div className="space-y-4 md:hidden">
      <div className="space-y-2">
        {/* 门票类型选择 */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="text-muted-foreground">
                {selectedOption
                  ? productOptions?.docs?.find((opt) => opt.id === selectedOption)?.title
                  : 'Select a ticket type'}
              </span>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent aria-describedby={undefined}>
            <DrawerHeader>
              <DrawerTitle>Select a ticket type</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-2">
              {productOptions?.docs?.map((option: ProductOption) => (
                <DrawerClose asChild key={option.id}>
                  <Button
                    variant={selectedOption === option.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => selectOption(option.id)}
                  >
                    {option.title}
                  </Button>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        {/* 日期选择 */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-between" disabled={!selectedTicket}>
              <span className="text-muted-foreground">
                {date ? format(date, 'PPP') : 'Select a date'}
              </span>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent aria-describedby={undefined}>
            <DrawerHeader>
              <DrawerTitle>Select a date</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <DatePicker date={date} onSelect={selectDate} isDisabled={isDateDisabled} />
            </div>
          </DrawerContent>
        </Drawer>

        {/* 时间选择 */}
        {selectedTicket && date && timeRangeOptions.length > 0 && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="text-muted-foreground">
                  {selectedTime || 'Select a time range'}
                </span>
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent aria-describedby={undefined}>
              <DrawerHeader>
                <DrawerTitle>Select a time range</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-2">
                {timeRangeOptions.map(({ id, time, isSelected }) => (
                  <DrawerClose asChild key={id}>
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => selectTime(time)}
                    >
                      {time}
                    </Button>
                  </DrawerClose>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* 游客类型选择 */}
        <div className="overflow-hidden">
          {allCustomerTypes.map((customerType) => (
            <CustomerTypeQuantity
              key={customerType}
              customerType={customerType}
              quantity={quantities[customerType] || 0}
              price={selectedDatePrices[customerType] || 0}
              lowestPrice={lowestPrices[customerType] || 0}
              onQuantityChange={handleQuantityChange}
              onQuantityInput={(type, value) => updateQuantity(type, value)}
              hasDate={Boolean(date)}
            />
          ))}
        </div>
      </div>

      <StatusMessage message={statusMessage} />

      {shouldShowTotal && <TotalPrice price={totalPrice} />}

      <SubmitButton
        isValid={isValid}
        isLoading={isLoading}
        onClick={handleCheckAvailability}
      />
    </div>
  )

  const renderDesktopContent = () => (
    <div className="space-y-4 hidden md:block">
      <div className="space-y-2">
        <Select value={selectedOption} onValueChange={selectOption}>
          <SelectTrigger>
            <SelectValue placeholder="Select a ticket type" />
          </SelectTrigger>
          <SelectContent>
            {productOptions?.docs?.map((option: ProductOption) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex justify-between items-center gap-4">
                  <span>{option.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          className={cn(
            'grid gap-2 transition-all duration-300',
            selectedTicket ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <Popover>
            <PopoverTrigger asChild>
              {selectedTicket ? (
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Select a date</span>}
                </Button>
              ) : (
                <div></div>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePicker date={date} onSelect={selectDate} isDisabled={isDateDisabled} />
            </PopoverContent>
          </Popover>

          {selectedTicket && date && timeRangeOptions.length > 0 && (
            <Select value={selectedTime} onValueChange={selectTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map(({ id, time }) => (
                  <SelectItem key={id} value={time}>
                    <span>{time}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="overflow-hidden">
            {allCustomerTypes.map((customerType) => (
              <CustomerTypeQuantity
                key={customerType}
                customerType={customerType}
                quantity={quantities[customerType] || 0}
                price={selectedDatePrices[customerType] || 0}
                lowestPrice={lowestPrices[customerType] || 0}
                onQuantityChange={handleQuantityChange}
                onQuantityInput={(type, value) => updateQuantity(type, value)}
                hasDate={Boolean(date)}
              />
            ))}
          </div>
        </div>
      </div>

      <StatusMessage message={statusMessage} />

      {shouldShowTotal && <TotalPrice price={totalPrice} />}

      <SubmitButton
        isValid={isValid}
        isLoading={isLoading}
        onClick={handleCheckAvailability}
      />
    </div>
  )

  return (
    <Tracker
      params={{
        source: 'TicketCard',
      }}
    >
      <Card>
        <CardHeader className="relative before:content-[''] before:absolute before:inset-0 before:bg-primary before:z-10 before:h-1 overflow-hidden">
          <CardTitle>Start Your Tour</CardTitle>
          <CardDescription>
            Select your ticket type, date, and time to check availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderDesktopContent()}
          {renderMobileContent()}
        </CardContent>
      </Card>
    </Tracker>
  )
}
