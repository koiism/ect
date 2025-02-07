import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import Link from 'next/link'

export const WishlistEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <Icon name="CiHeart" className="h-16 w-16 mb-4 text-muted-foreground" />
      <h3 className="text-xl font-medium mb-2">Wishlist is empty</h3>
      <p className="text-muted-foreground mb-4">Browse products and click the heart icon to add them to your wishlist</p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  )
}
