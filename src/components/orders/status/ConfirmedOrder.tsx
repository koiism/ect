import React from 'react'
import type { Order } from '@/payload-types'

interface ConfirmedOrderProps {
  order: Order
}

export const ConfirmedOrder: React.FC<ConfirmedOrderProps> = ({ order }) => {
  return (
    <div className="container py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Booking Confirmed</h1>
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Your booking has been confirmed! We look forward to serving you.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="font-medium mb-2">Booking Details:</h2>
        <div className="text-sm text-gray-600">
          <p>Date: {new Date(order.date || '').toLocaleDateString()}</p>
          <p>Time: {order.time}</p>
          <p>Quantity: {
            Object.entries(order.quantity || {}).filter(([_type, count]) => count && count > 0).map(([type, count]) => (
              `${type}: ${count}`
            )).join(', ')
          }</p>
        </div>
      </div>
    </div>
  )
}
