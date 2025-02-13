'use client'

import React, { useRef, useEffect, memo, forwardRef } from 'react'
import { ProductOption, Product } from '@/payload-types'
import { TicketCard } from '@/components/products/TicketCard'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { useTicketStore } from '@/stores/ticketStore'

// 移动端吸底按钮组件
const MobileBookButton = memo(({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} className="w-full" size="lg">
    <Icon name="HiCalendar" className="mr-2" />
    Book Now
  </Button>
))
MobileBookButton.displayName = 'MobileBookButton'

// 桌面端布局组件
const DesktopLayout = memo(
  forwardRef<
    HTMLDivElement,
    {
      children: React.ReactNode
      productOptions: { docs?: ProductOption[] }
    }
  >(({ children, productOptions }, ref) => (
    <div className="flex-1">
      {children}
      {/* 移动端 TicketCard */}
      <div className="mt-8 md:hidden" ref={ref}>
        <TicketCard productOptions={productOptions} />
      </div>
    </div>
  )),
)
DesktopLayout.displayName = 'DesktopLayout'

// 桌面端预订卡片组件
const DesktopTicketCard = memo(
  ({ productOptions }: { productOptions: { docs?: ProductOption[] } }) => (
    <div className="w-[380px] flex-shrink-0 hidden md:block">
      <div className="sticky top-24">
        <TicketCard productOptions={productOptions} />
      </div>
    </div>
  ),
)
DesktopTicketCard.displayName = 'DesktopTicketCard'

interface ProductPageClientProps {
  product: Product | null
  children: React.ReactNode
}

export default function ProductPageClient({ product, children }: ProductPageClientProps) {
  const ticketCardRef = useRef<HTMLDivElement>(null)
  const [isTicketCardVisible, setIsTicketCardVisible] = React.useState(false)

  // 初始化 ticketStore
  useEffect(() => {
    if (product?.productOptions?.docs) {
      // 确保 docs 是 ProductOption[] 类型
      const options = product.productOptions.docs.filter((doc): doc is ProductOption =>
        typeof doc !== 'string' && doc !== null && doc !== undefined
      )
      useTicketStore.getState().initialize(options)
    }
  }, [product?.productOptions?.docs])

  // 设置 IntersectionObserver 监听 TicketCard 可见性
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTicketCardVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
      },
    )

    if (ticketCardRef.current) {
      observer.observe(ticketCardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToTicketCard = () => {
    ticketCardRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!product) return null

  // 转换 productOptions 为正确的类型
  const safeProductOptions = {
    docs: product.productOptions?.docs?.filter((doc): doc is ProductOption =>
      typeof doc !== 'string' && doc !== null && doc !== undefined
    ),
  }

  return (
    <div className="relative">
      {/* 主要布局 */}
      <div className="flex flex-col lg:flex-row gap-8">
        <DesktopLayout ref={ticketCardRef} productOptions={safeProductOptions}>
          {children}
        </DesktopLayout>
        <DesktopTicketCard productOptions={safeProductOptions} />
      </div>

      {/* 移动端吸底按钮 */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden transition-all duration-300 ${
          isTicketCardVisible ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <MobileBookButton onClick={scrollToTicketCard} />
      </div>

      {/* 占位元素,防止内容被吸底按钮遮挡 */}
      <div className="h-[76px] md:hidden" />
    </div>
  )
}
