import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import {
  CustomerType,
  customerTypeLabels,
  OrderStatus,
  orderStatusLabels,
} from '@/constants/collections.constants'
import { calculateOrderAmount } from '@/utilities/orderUtils'
import { Order } from '@/payload-types'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: '用户数据',
    useAsTitle: 'id',
    defaultColumns: ['id', 'ticket', 'date', 'time', 'status', 'createdAt'],
  },
  labels: {
    singular: '订单',
    plural: '订单',
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: anyone,
  },
  fields: [
    {
      name: 'totalAmount',
      label: '订单总额',
      type: 'number',
      virtual: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          () => undefined // 虚拟字段不需要存储值
        ],
        afterRead: [
          async ({ data, req }) => {
            if (!data?.ticket || !data.date || !data.time) {
              return 0
            }

            try {
              // 获取完整的ticket数据
              const ticket = await req.payload.findByID({
                collection: 'product-options',
                id: data.ticket as string,
              })

              if (!ticket) {
                return 0
              }

              const orderWithTicket = {
                ...data,
                ticket,
              } as Order

              const result = calculateOrderAmount(orderWithTicket)
              return result.success ? result.amount : 0
            } catch (error) {
              console.error('Error calculating order amount:', error)
              return 0
            }
          },
        ],
      },
    },
    {
      name: 'status',
      label: '订单状态',
      admin: {
        position: 'sidebar',
        // readOnly: true,
      },
      type: 'select',
      required: true,
      defaultValue: OrderStatus.PENDING,
      options: Object.entries(orderStatusLabels).map(([value, label]) => ({
        label,
        value,
      })),
    },
    {
      name: 'quantity',
      label: '数量',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      type: 'group',
      fields: Object.values(CustomerType).map((type) => ({
        name: type,
        label: customerTypeLabels[type],
        type: 'number',
        defaultValue: 0,
        admin: {
          readOnly: true,
        },
      })),
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: '订单信息',
          fields: [
            {
              name: 'ticket',
              label: '票种',
              type: 'relationship',
              relationTo: 'product-options',
              required: true,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'product',
              label: '产品',
              type: 'relationship',
              relationTo: 'products',
              required: true,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'date',
              label: '日期',
              type: 'date',
              required: true,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'time',
              label: '时间',
              type: 'text',
              required: true,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'email',
              label: '邮箱',
              type: 'email',
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'requiredInfo',
              label: '预订信息',
              type: 'array',
              admin: {
                readOnly: true,
              },
              fields: [
                {
                  name: 'info',
                  type: 'group',
                  fields: [
                    {
                      name: 'name',
                      label: '名称',
                      type: 'text',
                      required: true,
                      admin: {
                        readOnly: true,
                      },
                    },
                    {
                      name: 'value',
                      label: '信息',
                      type: 'array',
                      admin: {
                        readOnly: true,
                      },
                      fields: [
                        {
                          name: 'field',
                          type: 'group',
                          fields: [
                            {
                              type: 'row',
                              fields: [
                                {
                                  name: 'key',
                                  type: 'text',
                                  required: true,
                                  admin: {
                                    readOnly: true,
                                  },
                                },
                                {
                                  name: 'value',
                                  type: 'text',
                                  required: true,
                                  admin: {
                                    readOnly: true,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'PayPal 订单信息',
          fields: [
            {
              type: 'collapsible',
              label: 'PayPal 订单信息',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'paypalOrderId',
                  label: 'PayPal 订单 ID',
                  type: 'text',
                  admin: {
                    readOnly: true,
                  },
                },
                {
                  name: 'paymentDetails',
                  label: '支付详情',
                  type: 'json',
                  admin: {
                    readOnly: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
