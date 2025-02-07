import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { LayoutProvider } from './Layout'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </LayoutProvider>
    </ThemeProvider>
  )
}
