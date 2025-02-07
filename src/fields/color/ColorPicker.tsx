'use client'

import React from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { HexColorPicker } from 'react-colorful'

export const ColorPicker: React.FC<{
  path: string
  field: {
    label?: string
    required?: boolean
  }
}> = (props) => {
  const { path, field: { label, required } } = props
  const { value, setValue } = useField<string>({ path })
  const [open, setOpen] = React.useState(false)

  return (
    <div className="field-type">
      <FieldLabel
        htmlFor={path}
        label={`${label}: ${value || '未选择'}`}
        required={required}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="w-[60px] h-[34px] border-2"
            style={{
              backgroundColor: value || '#ffffff',
              borderColor: value || '#e2e2e2'
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <HexColorPicker
            color={value || '#ffffff'}
            onChange={(newColor) => setValue(newColor)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ColorPicker
