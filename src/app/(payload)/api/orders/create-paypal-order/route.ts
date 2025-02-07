import { NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payloadClient'
import { OrderStatus } from '@/constants/collections.constants'
import { calculateOrderAmount, createPaypalOrder } from '@/utilities/orderUtils'

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json()
    const payloadClient = await getPayload()

    // 获取订单信息
    const order = await payloadClient.findById({
      collection: 'orders',
      id: orderId,
    })

    // 验证订单
    if (!order) {
      return NextResponse.json({ error: 'order not found' }, { status: 404 })
    }

    if (order.status !== OrderStatus.UNPAID) {
      return NextResponse.json({ error: 'order status is not correct' }, { status: 400 })
    }

    // 计算订单总金额
    const orderAmount = calculateOrderAmount(order)
    if (!orderAmount.success) {
      return NextResponse.json({ error: orderAmount.error }, { status: 400 })
    }

    // 创建PayPal订单
    const response = await createPaypalOrder(orderAmount.amount!)
    if (!response) {
      throw new Error('Failed to create PayPal order')
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating PayPal order:', error)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}
