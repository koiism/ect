'use client'

import React, { useState, useEffect } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { OrderStatus } from '@/constants/collections.constants'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  HelpCircle,
  Loader2,
  Timer,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface UnpaidOrderProps {
  orderId: string
  onStatusChange?: (status: OrderStatus) => void
}

export const UnpaidOrder: React.FC<UnpaidOrderProps> = ({ orderId, onStatusChange }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      setError('Payment session expired. Please start over.')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleBack = () => {
    onStatusChange?.(OrderStatus.PENDING)
  }

  const createOrder = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/orders/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment. Please try again.')
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Error creating PayPal order:', error)
      setError(
        error instanceof Error ? error.message : 'Failed to create payment. Please try again.',
      )
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async (details: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paypalOrderId: details.id,
          paymentDetails: details,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          onStatusChange?.(OrderStatus.UNSHIPPED)
          router.refresh()
        }, 1500)
      } else {
        throw new Error('Payment confirmation failed. Please contact support.')
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      setError(
        error instanceof Error ? error.message : 'Payment confirmation failed. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-4 md:py-8 px-4 md:px-0 pt-12 md:pt-24">
      <div className="mb-6 md:mb-8">
        <Button variant="ghost" className="gap-2" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Order Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <CreditCard className="w-5 h-5" />
              Order Details
            </CardTitle>
            <CardDescription className="text-sm md:text-base">Order ID: {orderId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="text-muted-foreground">Payment Status</span>
              <span className="font-medium">Pending Payment</span>
            </div>
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="text-muted-foreground">Time Remaining</span>
              <span className="flex items-center gap-2 font-medium">
                <Timer className="w-4 h-4" />
                {formatTime(timeLeft)}
              </span>
            </div>
            <Separator />
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>Payment Instructions</span>
              </div>
              <ul className="text-sm md:text-base space-y-2">
                <li>• Complete payment within the time limit</li>
                <li>• Your order will be processed automatically after payment</li>
                <li>• Keep your order ID for reference</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payment Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Select Payment Method</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Choose your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSuccess && (
              <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Payment Successful</AlertTitle>
                <AlertDescription>Processing your order...</AlertDescription>
              </Alert>
            )}

            <div
              className={`transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                  currency: 'USD',
                }}
              >
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    shape: 'rect',
                    label: 'pay',
                  }}
                  createOrder={createOrder}
                  onApprove={async (_data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture()
                      await handlePaymentSuccess(details)
                    }
                  }}
                />
              </PayPalScriptProvider>
            </div>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm md:text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>Need help? Contact support</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
