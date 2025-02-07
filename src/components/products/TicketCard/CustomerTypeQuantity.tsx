import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { CustomerType } from '@/hooks/useTicketSelection'
import { Input } from '@/components/ui/input'

interface CustomerTypeQuantityProps {
  customerType: string
  quantity: number
  price: number
  lowestPrice: number
  onQuantityChange: (type: CustomerType, action: 'increase' | 'decrease') => void
  onQuantityInput: (type: CustomerType, value: number) => void
  hasDate?: boolean
}

export function CustomerTypeQuantity({
  customerType,
  quantity,
  price,
  lowestPrice,
  onQuantityChange,
  onQuantityInput,
  hasDate,
}: CustomerTypeQuantityProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="font-medium">{customerType}</span>
        <span className="text-sm text-muted-foreground">
          {hasDate ? `$${price}` : `From $${lowestPrice}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(customerType as CustomerType, 'decrease')}
          disabled={quantity === 0}
        >
          <Icon name="HiMinus" className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          className="w-12 text-center"
          value={quantity}
          onChange={(e) => onQuantityInput(customerType as CustomerType, parseInt(e.target.value) || 0)}
          min={0}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onQuantityChange(customerType as CustomerType, 'increase')}
        >
          <Icon name="HiPlus" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
