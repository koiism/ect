'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { useLayout } from '@/providers/Layout'

interface PageClientProps {
  hideSearchInput: boolean
}

const PageClient: React.FC<PageClientProps> = ({ hideSearchInput }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const { setHideSearchInput } = useLayout()

  useEffect(() => {
    setHeaderTheme('light')
    setHideSearchInput(hideSearchInput)
    return () => {
      setHideSearchInput(false)
    }
  }, [setHeaderTheme, setHideSearchInput, hideSearchInput])
  return <React.Fragment />
}

export default PageClient
