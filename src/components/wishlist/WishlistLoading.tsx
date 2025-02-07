import React from 'react'
import { Icon } from '@/components/Icon'

export const WishlistLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin">
        <Icon name="CiCircleRemove" className="h-8 w-8" />
      </div>
    </div>
  )
}
