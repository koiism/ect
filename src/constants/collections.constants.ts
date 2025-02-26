export enum CustomerType {
  Adult = 'Adult',
  Youth = 'Youth',
  Children = 'Children',
  Senior = 'Senior',
}

export const customerTypeLabels: Record<CustomerType, string> = {
  [CustomerType.Adult]: '成人',
  [CustomerType.Youth]: '青年',
  [CustomerType.Children]: '儿童',
  [CustomerType.Senior]: '老人',
}

export enum OrderStatus {
  PENDING = 'pending',
  UNPAID = 'unpaid',
  UNSHIPPED = 'unshipped',
  SHIPPED = 'shipped',
  CONFIRMED = 'confirmed',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
}

export const orderStatusLabels = {
  [OrderStatus.PENDING]: '待下单',
  [OrderStatus.UNPAID]: '待付款',
  [OrderStatus.UNSHIPPED]: '待发货',
  [OrderStatus.SHIPPED]: '已发货',
  [OrderStatus.CONFIRMED]: '已确认',
  [OrderStatus.REFUNDING]: '待退款',
  [OrderStatus.REFUNDED]: '已退款',
}

export const months = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}月`,
  value: String(i + 1),
}))

export const defaultMonths = Array.from({ length: 12 }, (_, i) => String(i + 1))

export const days = Array.from({ length: 7 }, (_, i) => ({
  label: `星期${i + 1}`,
  value: String(i + 1),
}))

export const defaultDays = Array.from({ length: 7 }, (_, i) => String(i + 1))

export const applicableCustomers = Object.entries(CustomerType).map(([_, value]) => ({
  label: customerTypeLabels[value as CustomerType],
  value,
}))
