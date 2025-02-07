import React from 'react'

export const RefundedOrder: React.FC = () => {
  return (
    <div className="container py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Refund Completed</h1>
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Refund has been completed. The funds will be returned to your payment account within 1-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
