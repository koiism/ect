import type { Order } from '@/payload-types'
import { OrderFormClient } from '@/components/forms/OrderFormClient'
import { OrderStatus } from '@/constants/collections.constants'

interface PendingOrderProps {
  order: Order & { ticket: any }
  orderId: string
  onStatusChange: (status: OrderStatus) => void
}

export const PendingOrder: React.FC<PendingOrderProps> = ({ order, orderId, onStatusChange }) => {
  return (
    <div className="container pt-16 md:pt-24">
      <OrderFormClient
        formData={{
          productOption: order.ticket,
        }}
        orderId={orderId}
        initialQuantities={order.quantity || {}}
        order={order}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}
