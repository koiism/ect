'use client'
import React from 'react'
import { useListQuery } from '@payloadcms/ui'

export default function Test() {
  const {
    data,
    defaultSort,
    query,
    defaultLimit,
    handlePageChange,
    handlePerPageChange,
    handleSearchChange,
    handleSortChange,
  } = useListQuery()
  return (
    <div>
      <button onClick={() => handlePageChange?.(1)}>PageChange {">"} 1</button>
      <br />
      <button onClick={() => handlePerPageChange?.(1)}>PerPageChange {">"} 1</button>
      <br />
      <button onClick={() => handleSearchChange?.('test')}>SearchChange {">"} test</button>
      <br />
      <button onClick={() => handleSortChange?.('test')}>SortChange {">"} test</button>
      <br />
      <br />
      {JSON.stringify(query)}
    </div>
  )
}
