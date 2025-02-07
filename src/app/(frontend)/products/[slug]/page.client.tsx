'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ProductOption, Product } from '@/payload-types'
import { TicketCard } from '@/components/products/TicketCard'
import { TicketSelection } from '@/hooks/useTicketSelection'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'

interface ProductPageClientProps {
  product: Product | null
  children: React.ReactNode
}

export default function ProductPageClient({ product, children }: ProductPageClientProps) {
  const ticketCardRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState<TicketSelection>(() => {
    const firstOption = product?.productOptions?.docs?.[0]
    return {
      selectedOption:
        product?.productOptions?.docs?.length === 1 ? (firstOption as ProductOption).id : '',
      date: undefined,
      selectedTime: '',
      quantities: {},
    }
  })
  const [isTicketCardVisible, setIsTicketCardVisible] = useState(false)

  const scrollToTicketCard = () => {
    ticketCardRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTicketCardVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
      }
    )

    if (ticketCardRef.current) {
      observer.observe(ticketCardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!product) return null

  return (
    <div className="relative">
      {/* 桌面端布局 */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {children}
          {/* 移动端TicketCard */}
          <div className="mt-8 md:hidden" ref={ticketCardRef}>
            <TicketCard
              productOptions={product.productOptions as { docs?: ProductOption[] }}
              value={selection}
              onChange={setSelection}
            />
          </div>
        </div>

        {/* 桌面端预订卡片 */}
        <div className="w-[380px] flex-shrink-0 hidden md:block">
          <div className="sticky top-24">
            <TicketCard
              productOptions={product.productOptions as { docs?: ProductOption[] }}
              value={selection}
              onChange={setSelection}
            />
          </div>
        </div>
      </div>

      {/* 移动端吸底按钮 */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden transition-all duration-300 ${
          isTicketCardVisible ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <Button onClick={scrollToTicketCard} className="w-full" size="lg">
          <Icon name="HiCalendar" className="mr-2" />
          Book Now
        </Button>
      </div>
      <div className="h-[76px] md:hidden" /> {/* 占位元素,防止内容被吸底按钮遮挡 */}
    </div>
  )
}
