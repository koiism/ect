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
import { TicketSelection, useTicketSelection } from '@/hooks/useTicketSelection'
import { useRouter } from 'next/navigation'
import { CustomerTypeQuantity } from './CustomerTypeQuantity'
import { useState, useMemo, useCallback, memo } from 'react'
import { Tracker } from '@/tracking'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

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
    formattedSelection,
  }: {
    isValid: boolean
    isLoading: boolean
    onClick: () => void
    formattedSelection: any
  }) => (
    <Tracker
      click={{
        buttonClick: {
          buttonName: 'check_availability',
          extra: formattedSelection,
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
  value?: TicketSelection
  onChange?: (selection: TicketSelection) => void
}

export function TicketCard({ productOptions, value, onChange }: TicketCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {
    selection,
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
    formattedSelection,
  } = useTicketSelection({ productOptions, value, onChange })

  // 使用useMemo缓存状态消息计算
  const statusMessage = useMemo(() => {
    if (!selectedTicket) {
      return 'Please select a ticket type'
    }
    if (!formattedSelection.date) {
      return 'Please select a date'
    }
    if (availableTimeRanges.length > 0 && !formattedSelection.selectedTime) {
      return 'Please select a time range'
    }
    const totalQuantity = Object.values(selection.quantities).reduce(
      (sum, quantity) => sum + quantity,
      0,
    )
    if (totalQuantity === 0) {
      return 'Please select at least one visitor'
    }
    return null
  }, [
    selectedTicket,
    formattedSelection.date,
    formattedSelection.selectedTime,
    availableTimeRanges.length,
    selection.quantities,
  ])

  // 使用useCallback优化事件处理函数
  const handleCheckAvailability = useCallback(async () => {
    try {
      setIsLoading(true)
      const orderId = await createOrder()
      if (orderId) {
        router.push(`/checkout?orderId=${orderId}`)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }, [createOrder, router])

  // 使用useCallback优化选择处理函数
  const handleTicketTypeSelect = useCallback(
    (value: string) => {
      updateSelection({ selectedOption: value })
    },
    [updateSelection],
  )

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      updateSelection({ date })
    },
    [updateSelection],
  )

  const handleTimeSelect = useCallback(
    (time: string) => {
      updateSelection({ selectedTime: time })
    },
    [updateSelection],
  )

  // 使用useMemo缓存是否显示总价
  const shouldShowTotal = useMemo(
    () =>
      Boolean(
        selectedTicket &&
          selection.date &&
          Object.values(selection.quantities).some((quantity) => (quantity ?? 0) > 0),
      ),
    [selectedTicket, selection.date, selection.quantities],
  )

  // 使用useMemo缓存可选时间段渲染
  const timeRangeOptions = useMemo(
    () =>
      availableTimeRanges.map((timeRange) => ({
        id: timeRange.id,
        time: timeRange.time,
        isSelected: selection.selectedTime === timeRange.time,
      })),
    [availableTimeRanges, selection.selectedTime],
  )

  const renderMobileContent = () => (
    <div className="space-y-4 md:hidden">
      <div className="space-y-2">
        {/* 门票类型选择 */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="text-muted-foreground">
                {selection.selectedOption
                  ? productOptions?.docs?.find((opt) => opt.id === selection.selectedOption)?.title
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
                    variant={selection.selectedOption === option.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleTicketTypeSelect(option.id)}
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
                {selection.date ? format(selection.date, 'PPP') : 'Select a date'}
              </span>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent aria-describedby={undefined}>
            <DrawerHeader>
              <DrawerTitle>Select a date</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <DatePicker
                date={selection.date}
                onSelect={handleDateSelect}
                isDisabled={isDateDisabled}
              />
            </div>
          </DrawerContent>
        </Drawer>

        {/* 时间选择 */}
        {selectedTicket && selection.date && timeRangeOptions.length > 0 && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="text-muted-foreground">
                  {selection.selectedTime || 'Select a time range'}
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
                      onClick={() => handleTimeSelect(time)}
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
              quantity={selection.quantities[customerType] || 0}
              price={selectedDatePrices[customerType] || 0}
              lowestPrice={lowestPrices[customerType] || 0}
              onQuantityChange={handleQuantityChange}
              onQuantityInput={(type, value) =>
                updateSelection({
                  quantities: {
                    ...selection.quantities,
                    [type]: value,
                  },
                })
              }
              hasDate={Boolean(selection.date)}
            />
          ))}
        </div>
      </div>

      <StatusMessage message={statusMessage} />

      {shouldShowTotal && <TotalPrice price={totalPrice} />}

      <SubmitButton
        isValid={Boolean(isValid)}
        isLoading={isLoading}
        onClick={handleCheckAvailability}
        formattedSelection={formattedSelection}
      />
    </div>
  )

  const renderDesktopContent = () => (
    <div className="space-y-4 hidden md:block">
      <div className="space-y-2">
        <Select value={selection.selectedOption} onValueChange={handleTicketTypeSelect}>
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
                    !selection.date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selection.date ? format(selection.date, 'PPP') : <span>Select a date</span>}
                </Button>
              ) : (
                <div></div>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePicker
                date={selection.date}
                onSelect={handleDateSelect}
                isDisabled={isDateDisabled}
              />
            </PopoverContent>
          </Popover>

          {selectedTicket && selection.date && timeRangeOptions.length > 0 && (
            <Select value={selection.selectedTime} onValueChange={handleTimeSelect}>
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
                quantity={selection.quantities[customerType] || 0}
                price={selectedDatePrices[customerType] || 0}
                lowestPrice={lowestPrices[customerType] || 0}
                onQuantityChange={handleQuantityChange}
                onQuantityInput={(type, value) =>
                  updateSelection({
                    quantities: {
                      ...selection.quantities,
                      [type]: value,
                    },
                  })
                }
                hasDate={Boolean(selection.date)}
              />
            ))}
          </div>
        </div>
      </div>

      <StatusMessage message={statusMessage} />

      {shouldShowTotal && <TotalPrice price={totalPrice} />}

      <SubmitButton
        isValid={Boolean(isValid)}
        isLoading={isLoading}
        onClick={handleCheckAvailability}
        formattedSelection={formattedSelection}
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
