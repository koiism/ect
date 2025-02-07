'use client'

import React from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { iconOptions, Icons, IconType } from './options'
import { Input } from '@/components/ui/input'

export const IconSelect: React.FC<{
  path: string
  field: {
    label?: string
    required?: boolean
  }
}> = ({ path, field: { label, required }}) => {
  const { value, setValue } = useField<IconType>({ path })
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const renderIcon = () => {
    if (!mounted || !value) return null
    const IconComponent = Icons[value]
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null
  }

  const filteredIcons = React.useMemo(() => {
    return Object.entries(iconOptions).filter(([icon, label]) =>
      label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="field-type">
      <FieldLabel htmlFor={path} label={`${label}: ${value || '未选择'}`} required={required} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" variant='default'>
            <div className="flex items-center gap-2">
              {renderIcon()}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-4">
          <div className="space-y-4">
            <Input
              placeholder="搜索图标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
            <div className="grid grid-cols-6 gap-2 max-h-52 overflow-y-auto">
              {filteredIcons.map(([icon, label]) => {
                const Icon = mounted ? Icons[icon as IconType] : null
                return (
                  <Button
                    key={icon}
                    variant={value === icon ? "default" : "secondary"}
                    size="icon"
                    title={label as string}
                    onClick={() => {
                      setValue(icon)
                      setOpen(false)
                    }}
                  >
                    {Icon && <Icon className="h-6 w-6" />}
                  </Button>
                )
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center text-sm text-muted-foreground">
                未找到图标
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default IconSelect
