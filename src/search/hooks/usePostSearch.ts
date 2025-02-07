'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchState } from '../types/index'

export const usePostSearch = () => {
  const router = useRouter()
  const [state, setState] = useState<SearchState>({
    query: '',
    type: 'posts',
    results: [],
    loading: false,
    error: null,
  })

  const search = useCallback(async (query: string) => {
    if (!query) {
      setState((prev) => ({ ...prev, results: [], loading: false, error: null }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const searchParams = new URLSearchParams()
      searchParams.set('q', query)

      const response = await fetch(`/api/search/posts?${searchParams.toString()}`)
      const data = await response.json()

      setState((prev) => ({
        ...prev,
        results: data.results,
        loading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Search failed. Please try again later.',
        loading: false,
      }))
    }
  }, [])

  const handleSearch = useCallback((searchTerm: string) => {
    const searchParams = new URLSearchParams()
    searchParams.set('q', searchTerm)
    searchParams.set('type', 'posts')
    router.push(`/search?${searchParams.toString()}`)
  }, [router])

  return {
    ...state,
    search,
    handleSearch,
  }
}
