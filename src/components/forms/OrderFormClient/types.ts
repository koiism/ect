import { OrderField } from '@/payload-types'
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form'

export interface FormData {
  email: string
  forms: Record<string, string>[]
}

export interface BaseFieldProps {
  name: string
  label?: string
  width?: number
  required?: boolean
  defaultValue?: string
  blockType: string
}

export interface OptionItem {
  label: string
  value: string
  id?: string | null
}

export interface FieldProps extends BaseFieldProps {
  options?: OptionItem[]
  control: Control<FormData>
  errors: FieldErrors<FormData>
  register: UseFormRegister<FormData>
}

export interface FormStepProps {
  forms?: {
    type: string
    index: number
  }[]
}
