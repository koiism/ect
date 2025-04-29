import { Resend } from 'resend'
import { Order, ProductOption } from '@/payload-types'
import { calculateOrderAmount } from './orderUtils'
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

// 测试邮件
export async function sendTestEmail(payload: any) {
  try {
    await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_RESEND_FROM_NAME} <${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}>`,
      to: '1092333914@qq.com',
      subject: 'Test Email',
      text: JSON.stringify(payload, null, 2),
    })
  } catch (error) {
    console.error('Failed to send test email:', error)
  }
}

// 发送订单确认邮件
export async function sendOrderConfirmationEmail(order: Order) {
  try {
    const { email } = order

    if (!email) {
      throw new Error('Order email not found')
    }

    // 计算订单金额
    const orderAmount = calculateOrderAmount(order)
    if (!orderAmount.success) {
      throw new Error(orderAmount.error || 'Failed to calculate order amount')
    }

    // 发送邮件
    await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_RESEND_FROM_NAME} <${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      react: OrderConfirmationEmail({
        order,
        orderAmount: orderAmount.amount!,
      }),
    })

    console.log('Order confirmation email sent successfully')
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    throw error
  }
}

// 发送订单通知给管理员
export async function sendOrderNotificationToAdmin(order: Order) {
  try {
    // const ADMIN_EMAIL = [ '1092333914@qq.com', '544286175@qq.com' ] // 在这里硬编码管理员邮箱
    const ADMIN_EMAIL = [ '1092333914@qq.com' ] // 在这里硬编码管理员邮箱

    // 计算订单金额
    const orderAmount = calculateOrderAmount(order)
    if (!orderAmount.success) {
      throw new Error(orderAmount.error || 'Failed to calculate order amount')
    }

    // 发送邮件给管理员
    await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_RESEND_FROM_NAME} <${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `新订单通知 - ${
        new Date(order.date).toLocaleDateString()
      } - ${(
        order.ticket as ProductOption).useAsTitle
      }`,
      react: OrderConfirmationEmail({
        order,
        orderAmount: orderAmount.amount!,
        isAdminNotification: true,
      }),
    })

    console.log('Admin notification email sent successfully')
  } catch (error) {
    console.error('Failed to send admin notification email:', error)
    throw error
  }
}
