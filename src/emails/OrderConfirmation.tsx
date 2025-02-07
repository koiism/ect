import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { Order, ProductOption } from '@/payload-types'

interface OrderConfirmationEmailProps {
  order: Order
  orderAmount: number
  isAdminNotification?: boolean
}

export const OrderConfirmationEmail = ({
  order,
  orderAmount,
  isAdminNotification = false,
}: OrderConfirmationEmailProps) => {
  const previewText = isAdminNotification
    ? `新订单通知 - 订单号: ${order.id}`
    : `Your order ${order.id} has been confirmed`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{isAdminNotification ? '新订单通知' : 'Order Confirmation'}</Heading>
          <Text style={text}>{isAdminNotification ? '尊敬的管理员：' : 'Dear Customer:'}</Text>
          <Text style={text}>
            {isAdminNotification
              ? '系统收到了一个新的订单，以下是订单详情：'
              : 'Thank you for your purchase! Your order has been confirmed. Here are the details of your order:'}
          </Text>

          {isAdminNotification ? (
            <Section style={boxInfos}>
              <Text style={boxInfo}>
                <h2>订单号</h2> {order.id}
              </Text>
              <Text style={boxInfo}>
                <h2>产品名称</h2> {(order.ticket as ProductOption).useAsTitle}
              </Text>
              <Text style={boxInfo}>
                <h2>订单金额</h2> ${orderAmount}
              </Text>
              <Text style={boxInfo}>
                <h2>订单日期</h2> {new Date(order.date).toLocaleDateString()}
              </Text>
              <Text style={boxInfo}>
                <h2>订单时间</h2> {order.time}
              </Text>
              <Text style={boxInfo}>
                <h2>客户信息</h2>
                <br />
                {order.requiredInfo?.map((field) => (
                  <Text style={boxInfo} key={field.id}>
                    <strong>{field.info.name}</strong>
                    {field.info.value?.map((value) => (
                      <Text style={boxInfo} key={value.id}>
                        <strong>{value.field.key}</strong> {value.field.value}
                      </Text>
                    ))}
                  </Text>
                ))}
              </Text>
            </Section>
          ) : (
            <>
              <Section style={boxInfos}>
                <Text style={boxInfo}>
                  <strong>Order ID:</strong> {order.id}
                </Text>
                <Text style={boxInfo}>
                  <strong>Order Status:</strong> Confirmed
                </Text>
                <Text style={boxInfo}>
                  <strong>Order Amount:</strong> ${orderAmount}
                </Text>
                <Text style={boxInfo}>
                  <strong>Booking Date:</strong> {new Date(order.date).toLocaleDateString()}
                </Text>
                <Text style={boxInfo}>
                  <strong>Booking Time:</strong> {order.time}
                </Text>
              </Section>
              <Text style={text}>
                If you have any questions, please contact us at any time. You can also visit our
                website to view more details:
              </Text>
              <Link href={process.env.NEXT_PUBLIC_SERVER_URL} style={button}>
                Visit Website
              </Link>

              <Text style={footer}>
                This email is sent automatically by the system, please do not reply directly.
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '500',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const boxInfos = {
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  padding: '24px',
  margin: '24px 0',
}

const boxInfo = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const button = {
  backgroundColor: '#22C55E',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '50px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  margin: '24px 0',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
  textAlign: 'center' as const,
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}
