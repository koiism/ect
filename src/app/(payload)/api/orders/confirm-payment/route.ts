import { NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payloadClient'
import { OrderStatus } from '@/constants/collections.constants'
import { Order, ProductOption } from '@/payload-types'
import { calculateOrderAmount, confirmPaypalOrder } from '@/utilities/orderUtils'
import { sendOrderConfirmationEmail } from '@/utilities/emailUtils'
import { sendOrderNotificationToAdmin } from '@/utilities/emailUtils'

export async function POST(req: Request) {
  try {
    const { orderId, paypalOrderId, paymentDetails } = await req.json()
    const payloadClient = await getPayload()

    // 获取订单信息
    const order = await payloadClient.findById({
      collection: 'orders',
      id: orderId,
    }) as Order

    // 验证订单
    if (!order) {
      return NextResponse.json({ error: 'order not found' }, { status: 404 })
    }

    if (order.status !== OrderStatus.UNPAID) {
      return NextResponse.json({ error: 'order status is not correct' }, { status: 400 })
    }

    // 计算订单总金额
    const ticket = order.ticket as ProductOption

    if (!ticket) {
      return NextResponse.json({ error: 'ticket not found' }, { status: 404 })
    }

    // 计算订单总金额
    const orderAmount = calculateOrderAmount(order)
    if (!orderAmount.success) {
      return NextResponse.json({ error: orderAmount.error }, { status: 400 })
    }

    // 验证PayPal支付
    const paypalOrder = await confirmPaypalOrder(paypalOrderId)

    // 验证PayPal订单状态
    if (paypalOrder.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'PayPal payment not completed' }, { status: 400 })
    }

    // 验证支付金额
    const paidAmount = parseFloat(paypalOrder.purchase_units[0].amount.value)
    if (Math.abs(paidAmount - orderAmount.amount!) > 0.01) { // 允许0.01美元的误差
      return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 })
    }

    // 更新订单状态
    const { doc: updatedOrder } = await payloadClient.updateById({
      collection: 'orders',
      id: orderId,
      data: {
        status: OrderStatus.UNSHIPPED,
        paypalOrderId,
        paymentDetails,
      },
    })

    try {
      // 发送确认邮件
      void sendOrderConfirmationEmail(updatedOrder as Order)
      // 发送管理员通知邮件
      void sendOrderNotificationToAdmin(updatedOrder as Order)
    } catch (error) {
      console.error('Failed to send emails:', error)
      // 不要因为邮件发送失败而影响订单确认
    }

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
