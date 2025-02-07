import { useLayout } from "@/providers/Layout"
import { useEffect } from "react"

export const useHideHeaderSearchInput = () => {
  const { setHideSearchInput } = useLayout()

  useEffect(() => {
    setHideSearchInput(true)
    return () => {
      setHideSearchInput(false)
    }
  }, [setHideSearchInput])
}
