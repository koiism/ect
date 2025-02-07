import { Order, ProductOption } from '@/payload-types'

type DatePrice = {
  price: {
    [key: string]: number
  }
}

export function calculateOrderAmount(order: Order): {
  success: boolean
  amount?: number
  error?: string
} {
  try {
    const ticket = order.ticket as ProductOption

    if (!ticket.id) {
      return { success: false, error: 'ticket not found' }
    }

    if (!ticket.availableDate || !Array.isArray(ticket.availableDate)) {
      return {
        success: false,
        error: 'ticket configuration is invalid: missing availableDate',
      }
    }

    // 找到对应日期的价格
    const orderDate = new Date(order.date)
    const month = String(orderDate.getMonth() + 1) as ProductOption['availableDate'][number]['months'][number]
    const day = String(orderDate.getDay() || 7) as ProductOption['availableDate'][number]['days'][number]

    const dateOption = ticket.availableDate.find(
      (date) =>
        date.months.includes(month) &&
        date.days.includes(day) &&
        date.timeRange?.some((time) => time.time === order.time),
    )

    if (!dateOption || !dateOption.price) {
      return { success: false, error: 'invalid date or price' }
    }

    // 计算总金额
    let totalAmount = 0
    Object.entries(order.quantity || {}).forEach(([type, quantity]) => {
      if (quantity && dateOption.price && dateOption.price[type as keyof typeof dateOption.price]) {
        totalAmount += quantity * (dateOption.price[type as keyof typeof dateOption.price] || 0)
      }
    })

    if (totalAmount <= 0) {
      return { success: false, error: 'order amount is invalid' }
    }

    return { success: true, amount: totalAmount }
  } catch (error) {
    console.error('Error calculating order amount:', error)
    return { success: false, error: 'Failed to calculate order amount' }
  }
}

export async function getPaypalToken() {
  try {
    const Auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
    ).toString('base64')
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Auth}`,
      },
      body: `grant_type=client_credentials`,
    })

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting PayPal token:', error)
    return null
  }
}

export async function createPaypalOrder(totalAmount: number) {
  const token = await getPaypalToken()
  const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: totalAmount.toFixed(2) } }],
      payment_source: {
        paypal: {
          experience_context: {
            shipping_preference: 'NO_SHIPPING',
          },
        },
      },
    }),
  })

  const data = await response.json()
  return data
}

export async function confirmPaypalOrder(paypalOrderId: string) {
  const token = await getPaypalToken()
  const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  return data
}
