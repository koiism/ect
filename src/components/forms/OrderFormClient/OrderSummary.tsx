import React from 'react'
import { Calendar, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import SpotlightCard from '@/components/animations/SpotlightCard/SpotlightCard'
import type { Order, ProductOption } from '@/payload-types'
import type { CustomerType } from '@/constants/collections.constants'

interface OrderSummaryProps {
  formData: {
    productOption: ProductOption
  }
  order: Order
  initialQuantities: { [key in CustomerType]?: number | null }
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  formData,
  order,
  initialQuantities,
}) => {
  return (
    <div className="md:sticky top-8">
      <SpotlightCard className="p-6">
        <h3 className="text-xl font-semibold mb-4 hidden md:block">Order Summary</h3>

        {/* 产品图片 */}
        {formData.productOption.product &&
          typeof formData.productOption.product !== 'string' &&
          formData.productOption.product.images?.[0]?.image && (
            <div className="relative aspect-[3/2] mb-4 rounded-lg overflow-hidden hidden md:block">
              <Image
                src={
                  typeof formData.productOption.product.images[0].image === 'string'
                    ? formData.productOption.product.images[0].image
                    : formData.productOption.product.images[0].image.url || ''
                }
                alt={formData.productOption.product.title}
                className="object-cover w-full h-full"
                fill
                priority
              />
            </div>
          )}

        {/* 产品标题 */}
        <h4 className="text-lg font-medium mb-4">
          {typeof formData.productOption.product !== 'string'
            ? formData.productOption.product.title
            : ''}
        </h4>

        {/* 日期和时间 */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Date: {format(new Date(order.date), 'MM/dd/yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Time: {order.time}</span>
          </div>
        </div>

        {/* 门票信息 */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span className="font-medium">Tickets:</span>
          </div>
          {Object.entries(initialQuantities).map(([type, count]) => {
            if (!count || count <= 0) return null
            return (
              <div key={type} className="flex justify-between text-sm pl-6">
                <span>{type}</span>
                <span>x{count}</span>
              </div>
            )
          })}
        </div>

        {/* 价格信息 */}
        {typeof formData.productOption.product !== 'string' &&
          formData.productOption.product.lowestPrice && (
            <div className="text-sm">
              Total Amount: <span className="font-medium text-red-500">${order.totalAmount}</span>
            </div>
          )}
      </SpotlightCard>
    </div>
  )
}
