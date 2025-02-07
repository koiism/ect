import React from 'react'
import type { Order } from '@/payload-types'

interface DefaultOrderProps {
  order: Order
}

export const DefaultOrder: React.FC<DefaultOrderProps> = ({ order }) => {
  return (
    <div className="container py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              Order Status: {order.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
