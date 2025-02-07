'use client'

import { createContext, useCallback, useContext, useState } from 'react'

export type LayoutContextType = {
  hideSearchInput?: boolean
  setHideSearchInput: (hideSearchInput: boolean) => void
}

const initialLayoutContext: LayoutContextType = {
  hideSearchInput: false,
  setHideSearchInput: () => {},
}

const LayoutContext = createContext<LayoutContextType>(initialLayoutContext)

export const useLayout = () => useContext(LayoutContext)

export const LayoutProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [hideSearchInput, setHideSearchInput] = useState(false)
  return (
    <LayoutContext.Provider value={{ hideSearchInput, setHideSearchInput }}>
      {children}
    </LayoutContext.Provider>
  )
}
