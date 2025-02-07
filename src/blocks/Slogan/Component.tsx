'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/utilities/cn'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import type { SloganBlock as SloganBlockType } from '@/payload-types'
import { ANIMATION_CONFIG } from './animation.config'
import { getLinkPath } from '@/utilities/getLinkPath'

// 注册GSAP插件
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Observer)
}

type Keyword = NonNullable<SloganBlockType['keywords']>[number]

type Props = {
  className?: string
  baseVelocity?: number
  scrollMultiplier?: number
  smoothness?: number
} & SloganBlockType

export const SloganBlock: React.FC<Props> = ({
  className,
  keywords = [],
  baseVelocity = ANIMATION_CONFIG.BASE_VELOCITY,
  scrollMultiplier = ANIMATION_CONFIG.SCROLL_MULTIPLIER,
  smoothness = ANIMATION_CONFIG.SMOOTHNESS,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [repeatedKeywords, setRepeatedKeywords] = useState<Keyword[]>([])
  const velocityRef = useRef(baseVelocity)
  const isHoveredRef = useRef(false)
  const directionRef = useRef(1) // 1 表示向左，-1 表示向右

  // 计算并设置重复关键词
  const calculateRepeatCount = useCallback(() => {
    if (!wrapperRef.current || !keywords?.length) return 0

    const tempDiv = document.createElement('div')
    tempDiv.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;'
    tempDiv.innerHTML = keywords?.map(k => `
      <div class="inline-flex items-center gap-2 ml-2">
        <span>${k.text}</span>
        <span>✦</span>
      </div>
    `).join('')
    document.body.appendChild(tempDiv)
    const singleGroupWidth = tempDiv.offsetWidth
    document.body.removeChild(tempDiv)

    const screenWidth = wrapperRef.current.offsetWidth
    return Math.max(Math.ceil((screenWidth * 3) / singleGroupWidth), ANIMATION_CONFIG.MIN_REPEAT_COUNT)
  }, [keywords])

  // 初始化关键词组
  useEffect(() => {
    if (!keywords?.length) return

    const repeatCount = calculateRepeatCount()
    setRepeatedKeywords(Array(repeatCount).fill(keywords).flat())

    const handleResize = () => {
      const newRepeatCount = calculateRepeatCount()
      setRepeatedKeywords(Array(newRepeatCount).fill(keywords).flat())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [keywords, calculateRepeatCount])

  // 测量内容宽度
  useEffect(() => {
    if (!contentRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentWidth(entry.contentRect.width / 2) // 因为我们有两组内容
      }
    })
    observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [repeatedKeywords])

  // 创建动画
  const createAnimation = useCallback(() => {
    if (!contentRef.current || !contentWidth) return null

    const content = contentRef.current
    const duration = ANIMATION_CONFIG.BASE_DURATION / baseVelocity

    // 创建新动画
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'none' },
      paused: true,
      onComplete: () => {
        // 确保动画完成时立即重置到起点
        gsap.set(content, { x: 0 })
        tl.restart()
      },
      onReverseComplete: () => {
        // 确保反向动画完成时立即重置到终点
        gsap.set(content, { x: -contentWidth })
        tl.restart()
      }
    })

    // 创建无限滚动动画
    tl.fromTo(content,
      { x: 0 },
      {
        x: -contentWidth,
        duration,
        ease: 'none',
        onReverseComplete: function() {
          // 在每次反向完成时重置位置
          if (this.vars.runBackwards) {
            gsap.set(content, { x: -contentWidth })
          }
        },
        onComplete: function() {
          // 在每次正向完成时重置位置
          if (!this.vars.runBackwards) {
            gsap.set(content, { x: 0 })
          }
        }
      }
    )

    return tl
  }, [contentWidth, baseVelocity])

  // 更新动画方向和速度
  const updateAnimation = useCallback((tl: gsap.core.Timeline, direction: number, velocity: number) => {
    const timeScale = (velocity / baseVelocity) * direction
    const currentTime = tl.time()
    const totalDuration = tl.duration()

    // 根据方向设置动画的运行方向
    tl.vars.runBackwards = direction > 0

    gsap.to(tl, {
      timeScale,
      duration: smoothness,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: () => {
        // 确保动画在切换方向时保持连续性
        if (currentTime === 0 || currentTime === totalDuration) {
          if (direction > 0) {
            tl.progress(0)
          } else {
            tl.progress(1)
          }
        }
      }
    })
  }, [baseVelocity, smoothness])

  // 设置动画
  useEffect(() => {
    // 清理旧动画
    if (animationRef.current) {
      animationRef.current.kill()
    }

    // 创建新动画
    const tl = createAnimation()
    if (!tl) return

    animationRef.current = tl

    // 设置初始方向
    directionRef.current = ANIMATION_CONFIG.DIRECTION.INITIAL
    tl.play()
    updateAnimation(tl, directionRef.current, baseVelocity)

    // 创建滚动观察器
    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: ANIMATION_CONFIG.WHEEL_CONFIG.WHEEL_SPEED,
      onChangeY: (self) => {
        if (isHoveredRef.current || !tl) return

        // 获取滚动速度和方向
        const velocity = Math.abs(self.deltaY)
        const scrollingDown = self.deltaY > 0
        const newDirection = scrollingDown ? ANIMATION_CONFIG.DIRECTION.RIGHT : ANIMATION_CONFIG.DIRECTION.LEFT

        // 更新方向和速度
        if (newDirection !== directionRef.current) {
          directionRef.current = newDirection
          velocityRef.current = velocity > ANIMATION_CONFIG.VELOCITY_THRESHOLD
            ? baseVelocity + velocity * scrollMultiplier
            : baseVelocity

          // 在方向改变时确保动画连续性
          const progress = tl.progress()
          updateAnimation(tl, newDirection, velocityRef.current)
          tl.progress(progress)
        } else {
          // 只更新速度
          velocityRef.current = velocity > ANIMATION_CONFIG.VELOCITY_THRESHOLD
            ? baseVelocity + velocity * scrollMultiplier
            : baseVelocity
          updateAnimation(tl, directionRef.current, velocityRef.current)
        }
      },
      onStop: () => {
        if (!tl || isHoveredRef.current) return
        velocityRef.current = baseVelocity
        updateAnimation(tl, directionRef.current, baseVelocity)
      },
      debounce: false,
      tolerance: ANIMATION_CONFIG.WHEEL_CONFIG.SCROLL_TOLERANCE
    })

    return () => {
      observer.kill()
      if (tl) {
        tl.kill()
      }
    }
  }, [contentWidth, baseVelocity, scrollMultiplier, smoothness, createAnimation, updateAnimation])

  // 鼠标悬停处理
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    if (animationRef.current) {
      // 记录当前进度
      const currentProgress = animationRef.current.progress()
      // 暂停动画
      updateAnimation(animationRef.current, 0, baseVelocity)
      // 恢复到暂停时的进度
      animationRef.current.progress(currentProgress)
    }
  }, [baseVelocity, updateAnimation])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    if (animationRef.current) {
      // 记录当前进度
      const currentProgress = animationRef.current.progress()
      // 清除可能存在的补间动画
      gsap.killTweensOf(animationRef.current)
      // 应用新的动画状态，但保持当前进度
      updateAnimation(animationRef.current, directionRef.current, velocityRef.current)
      animationRef.current.progress(currentProgress)
    }
  }, [updateAnimation])

  if (!keywords?.length) return null

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'w-full bg-gradient-to-r from-gradient-start to-gradient-end py-2 overflow-hidden -rotate-1 relative my-8',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 添加渐变遮罩 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-gradient-start to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-gradient-to-l from-gradient-end to-transparent z-10" />
      </div>
      <div ref={contentRef} className="inline-flex whitespace-nowrap">
        {/* 使用两组关键词确保无缝循环 */}
        {[0, 1].map((groupIndex) => (
          <div key={groupIndex} className="inline-flex">
            {repeatedKeywords.map((keyword, index) => {
              const link = keyword.isLink ? getLinkPath(keyword.link) : ''
              const newTab = keyword.link?.newTab ?? false

              return <div
                key={`${groupIndex}-${index}`}
                className="inline-flex items-center gap-2 ml-2"
              >
                {link ? (
                  <a
                    href={link}
                    target={newTab ? '_blank' : undefined}
                    rel={newTab ? 'noopener noreferrer' : undefined}
                    className="text-primary-foreground font-medium text-lg hover:scale-110 transition-transform hover:underline"
                  >
                    {keyword.text}
                  </a>
                ) : (
                  <span className="text-primary-foreground font-medium text-lg hover:scale-110 transition-transform">
                    {keyword.text}
                  </span>
                )}
                <span className="text-primary-foreground/80 text-xl">✦</span>
              </div>
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
