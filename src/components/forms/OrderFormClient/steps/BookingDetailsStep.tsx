'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/utilities/cn'
import { fields } from '@/blocks/Form/fields'
import type { FormData, FieldProps, FormStepProps } from '../types'
import type { ProductOption } from '@/payload-types'
import { AlertCircle } from 'lucide-react'

interface BookingDetailsStepProps extends FormStepProps {
  productOption: ProductOption
}

export const BookingDetailsStep: React.FC<BookingDetailsStepProps> = ({ forms = [], productOption }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormData>()

  const getAllFields = () => {
    if (!productOption.requiredInfo || !Array.isArray(productOption.requiredInfo)) {
      return []
    }

    return productOption.requiredInfo.flatMap((info: any) => {
      if (typeof info === 'string' || !info.fields) {
        return []
      }
      return info.fields.map((field: any) => ({
        ...field,
        name: field.name,
      }))
    })
  }

  const convertFieldProps = (field: any, formIndex: number): FieldProps => {
    const fieldName = `forms.${formIndex}.${field.name}` as const

    // 开发环境下打印字段映射信息
    if (process.env.NODE_ENV === 'development') {
      console.log('Field mapping:', {
        originalField: field,
        mappedName: fieldName,
        formIndex,
      })
    }

    const baseProps = {
      name: fieldName,
      label: field.label || undefined,
      width: field.width || undefined,
      required: field.required || false,
      defaultValue: field.defaultValue || undefined,
      blockType: field.blockType,
    }

    const options = field.options?.map((opt: any) => ({
      label: opt.label,
      value: opt.value,
      id: opt.id || null,
    }))

    const rules = {
      required: field.required ? `${field.label} is required` : false,
      validate: field.validate || undefined,
    }

    return {
      ...baseProps,
      ...(options && { options }),
      control,
      errors,
      register: () => register(fieldName, rules),
    }
  }

  const allFields = getAllFields()

  const hasErrors = forms.some((_, formIndex) =>
    errors.forms?.[formIndex] && Object.keys(errors.forms[formIndex] || {}).length > 0
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Booking Details</h2>

      {hasErrors && (
        <div className="p-4 bg-error/10 text-error rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Please check and fill in all required fields correctly.</span>
        </div>
      )}

      {forms.map((form, formIndex) => (
        <div key={`${form.type}-${form.index}`} className="border rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium">
            {form.type} #{form.index}
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {allFields.map((field: any, fieldIndex: number) => {
              const Field = fields[field.blockType as keyof typeof fields] as React.FC<FieldProps>
              if (Field) {
                const fieldProps = convertFieldProps(field, formIndex)
                const fieldError = errors.forms?.[formIndex]?.[field.name]

                return (
                  <div
                    key={fieldIndex}
                    className={cn(
                      field.width === 100 ? 'sm:col-span-2' : '',
                      fieldError ? 'animate-shake' : ''
                    )}
                  >
                    <Field {...fieldProps} />
                    {fieldError && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldError.message}
                      </p>
                    )}
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
