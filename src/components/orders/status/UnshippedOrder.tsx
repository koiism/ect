import React from 'react'
import { OrderStatus } from '@/constants/collections.constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface UnshippedOrderProps {
  orderId: string
  onStatusChange?: (status: OrderStatus) => void
}

export const UnshippedOrder: React.FC<UnshippedOrderProps> = ({ orderId }) => {
  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center h-full pt-16 md:pt-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-primary">
            <Mail className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed</CardTitle>
          <CardDescription>
            Order ID: <span className="font-medium text-primary">#{orderId}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p>
              We will send the ticket information to your email three days before the event.
            </p>
            <p className="font-medium">
              Please ensure your email can receive emails.
            </p>
          </div>

          <Alert variant="default">
            <AlertDescription>
              Please check your spam folder if you haven&apos;t received the email.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
