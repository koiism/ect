import type { Order, ProductOption } from '@/payload-types'
import payloadClient from '@/utilities/payloadClient'
import { CheckoutClient } from './page.client'

export default async function CheckoutPage({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await Promise.resolve(rawSearchParams)
  const orderId = searchParams.orderId as string

  if (!orderId) {
    return <div className="container py-8 text-red-500 pt-16 md:pt-24">Invalid order information</div>
  }

  try {
    // 在服务端获取订单数据
    const order = await payloadClient.findById({
      collection: 'orders',
      id: orderId,
      depth: 3,
    }) as Order & { ticket: ProductOption }

    if (!order || !order.ticket) {
      return <div className="container py-8 text-red-500 pt-16 md:pt-24">Order not found</div>
    }

    const productOption = order.ticket

    // 将数据传递给客户端组件
    return (
      <CheckoutClient
        initialOrder={order}
        orderId={orderId}
        productOption={productOption}
      />
    )
  } catch (err) {
    console.error('Error loading order:', err)
    return <div className="container py-8 text-red-500 pt-16 md:pt-24">Error loading order</div>
  }
}
