'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { OrderStatus, CustomerType } from '@/constants/collections.constants'
import payloadClient from '@/utilities/payloadClient'
import type { Order, ProductOption } from '@/payload-types'
import { OrderFormSteps } from './OrderFormSteps'
import { ContactStep } from './steps/ContactStep'
import { BookingDetailsStep } from './steps/BookingDetailsStep'
import { ReviewStep } from './steps/ReviewStep'
import { OrderSummary } from './OrderSummary'
import { FormData } from './types'
import { getFormSteps } from './constants'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface OrderFormClientProps {
  formData: {
    productOption: ProductOption
  }
  orderId: string
  initialQuantities: { [key in CustomerType]?: number | null }
  order: Order
  onStatusChange: (status: OrderStatus) => void
}

export const OrderFormClient: React.FC<OrderFormClientProps> = ({
  formData,
  orderId,
  initialQuantities,
  order,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [currentStep, setCurrentStep] = useState(0)

  const requiredInfo = formData.productOption.requiredInfo

  const formSteps = getFormSteps(
    typeof requiredInfo === 'string' ? false : Boolean(requiredInfo?.length),
  )

  // Create forms based on initial quantities
  const forms = Object.entries(initialQuantities).flatMap(([type, count]) => {
    if (Number(count) <= 0) return []
    return Array.from({ length: Number(count) }, (_, index) => ({
      type,
      index: index + 1,
    }))
  })

  const buildDefaultValues = (): FormData => {
    if (order.requiredInfo?.length) {
      const defaultValues = {
        email: order.email || '',
        forms: order.requiredInfo.map((requiredInfo) => {
          const formData: Record<string, string> = {}
          requiredInfo.info?.value?.forEach((field) => {
            formData[field.field.key] = field.field.value || ''
          })
          return formData
        }),
      }

      // 开发环境下打印回填数据
      if (process.env.NODE_ENV === 'development') {
        console.log('Form default values:', defaultValues)
      }

      return defaultValues
    }

    return {
      email: '',
      forms: forms.map(() => ({})),
    }
  }

  const formMethods = useForm<FormData>({
    defaultValues: buildDefaultValues(),
    mode: 'onChange',
  })

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const subscription = formMethods.watch((value) => {
        console.log('Form values changed:', value)
      })
      return () => subscription.unsubscribe()
    }
  }, [formMethods])

  const handleNext = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault()
      const isValid = await formMethods.trigger()
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1))
      }
    },
    [formMethods, formSteps.length],
  )

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleSubmit = useCallback(
    async (data: FormData) => {
      if (currentStep !== formSteps.length - 1) {
        return
      }
      setIsLoading(true)
      setError(undefined)

      try {
        const orderData = {
          status: OrderStatus.UNPAID,
          email: data.email,
          requiredInfo: forms.map((form, index) => ({
            info: {
              name: `${form.type} ${form.index}`,
              value: Object.entries(data.forms[index]).map(([key, value]) => ({
                field: {
                  key: key.split('_')[1] || key,
                  value: String(value),
                },
              })),
            },
          })),
        }

        const { doc: order } = await payloadClient.updateById({
          collection: 'orders',
          id: orderId,
          data: orderData,
        })

        if (!order.id) {
          throw new Error('Order not found')
        }

        onStatusChange(OrderStatus.UNPAID)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error updating order:', error)
          setError({
            message: error.message || 'Something went wrong while updating the order.',
            status: 'error',
          })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [currentStep, forms, orderId, onStatusChange, formSteps.length],
  )

  return (
    <FormProvider {...formMethods}>
      <div className="order-1">
        <OrderFormSteps currentStep={currentStep} steps={formSteps} />

        <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-4 md:space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{`${error.status || ''} ${error.message}`}</span>
            </div>
          )}

          <div className="space-y-4 md:space-y-8 flex md:flex-row items-start justify-between gap-4 flex-col-reverse">
            <div className="order-1 w-full md:w-auto">
              <OrderSummary
                formData={formData}
                order={order}
                initialQuantities={initialQuantities}
              />
            </div>
            <div className="flex-1 w-full" style={{ marginTop: '0px' }}>
              {currentStep === 0 && <ContactStep />}
              {Boolean(formData.productOption.requiredInfo?.length) && currentStep === 1 && (
                <BookingDetailsStep forms={forms} productOption={formData.productOption} />
              )}
              {currentStep === (formData.productOption.requiredInfo?.length ? 2 : 1) && (
                <ReviewStep forms={forms} />
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t gap-4">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                Back
              </Button>
            )}
            {currentStep < formSteps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </span>
                ) : (
                  'Complete Booking'
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
