import React from 'react'
import { Button } from '@/components/ui/button'

interface WishlistPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const WishlistPagination: React.FC<WishlistPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous Page
      </Button>
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next Page
      </Button>
    </div>
  )
}
