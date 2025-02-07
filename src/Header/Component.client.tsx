'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Icon } from '../components/Icon'
import { SearchInput } from '@/search/components/SearchInput'
import { useLayout } from '@/providers/Layout'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = React.memo(({ header }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const { hideSearchInput } = useLayout()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  const headerProps = useMemo(() => {
    return theme ? { 'data-theme': theme } : {}
  }, [theme])

  const logoComponent = useMemo(
    () => (
      <Link href="/">
        <Logo loading="eager" priority="high" className="invert dark:invert-0" />
      </Link>
    ),
    [],
  )

  const headerNavComponent = useMemo(() => <HeaderNav header={header} />, [header])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 md:h-24 flex items-center justify-center"
        {...headerProps}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-md bg-muted/70 shadow-sm w-full mx-2 md:w-auto rounded-full h-12 md:h-16 px-6"
        >
          <div className="flex justify-between h-full items-center gap-2">
            {logoComponent}

            {/* 桌面端导航 */}
            <div className="hidden md:flex justify-end gap-4 w-[524px]">
              {!hideSearchInput && (
                <div className="w-full">
                  <SearchInput />
                </div>
              )}
              <Link
                href="/wishlist"
                className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Icon name="CiHeart" className="h-6 w-6" />
                <span className="hidden lg:inline">Wishlist</span>
              </Link>
              {headerNavComponent}
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="CiMenuBurger" className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* 移动端下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <div className="backdrop-blur-md bg-muted/70 mx-2 rounded-2xl shadow-lg p-6 space-y-6">
              {!hideSearchInput && (
                <div className="w-full">
                  <SearchInput />
                </div>
              )}
              <Link
                href="/wishlist"
                className="flex items-center gap-3 text-lg text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <Icon name="CiHeart" className="h-6 w-6" />
                <span>Wishlist</span>
              </Link>
              <nav className="flex flex-col gap-6">
                {headerNavComponent}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})

HeaderClient.displayName = 'HeaderClient'
