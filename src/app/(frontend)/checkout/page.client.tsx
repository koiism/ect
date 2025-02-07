'use client'

import { useState } from 'react'
import type { Order, ProductOption } from '@/payload-types'
import {
  PendingOrder,
  UnpaidOrder,
  UnshippedOrder,
  ConfirmedOrder,
  RefundingOrder,
  RefundedOrder,
  DefaultOrder
} from '@/components/orders/status'
import { OrderStatus } from '@/constants/collections.constants'
import { useHideHeaderSearchInput } from '@/hooks/useHideHeaderSearchInput'

interface CheckoutClientProps {
  initialOrder: Order
  orderId: string
  productOption: ProductOption
}

export const CheckoutClient: React.FC<CheckoutClientProps> = ({
  initialOrder,
  orderId,
  productOption
}) => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(initialOrder.status as OrderStatus)
  useHideHeaderSearchInput()

  // 根据订单状态显示不同组件
  switch (orderStatus) {
    case OrderStatus.PENDING:
      if (!productOption.requiredInfo) {
        return <div className="container py-8 text-red-500 pt-16 md:pt-24">Form configuration not found</div>
      }
      return (
        <PendingOrder
          order={initialOrder}
          orderId={orderId}
          onStatusChange={setOrderStatus}
        />
      )

    case OrderStatus.UNPAID:
      return (
        <UnpaidOrder
          orderId={orderId}
          onStatusChange={setOrderStatus}
        />
      )

    case OrderStatus.UNSHIPPED:
      return <UnshippedOrder orderId={orderId} onStatusChange={setOrderStatus} />

    case OrderStatus.CONFIRMED:
      return <ConfirmedOrder order={initialOrder} />

    case OrderStatus.REFUNDING:
      return <RefundingOrder />

    case OrderStatus.REFUNDED:
      return <RefundedOrder />

    default:
      return <DefaultOrder order={initialOrder} />
  }
}
