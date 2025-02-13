import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CustomerType } from '@/stores/ticketStore'

interface CustomerTypeQuantityProps {
  customerType: CustomerType
  quantity: number
  price: number
  lowestPrice: number
  onQuantityChange: (type: CustomerType, action: 'increase' | 'decrease') => void
  onQuantityInput: (type: CustomerType, value: number) => void
  hasDate: boolean
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
        <span className="text-sm font-medium">{customerType}</span>
        <span className="text-sm text-muted-foreground">
          {hasDate ? `$${price}` : `From $${lowestPrice}`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onQuantityChange(customerType, 'decrease')}
        >
          -
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityInput(customerType, parseInt(e.target.value) || 0)}
          className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onQuantityChange(customerType, 'increase')}
        >
          +
        </Button>
      </div>
    </div>
  )
}
