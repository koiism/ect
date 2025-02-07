import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { FormBlock as FormBlockClient } from '@/components/forms'

export type Value = string

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
}

export const FormBlock: React.FC<FormBlockType> = (props) => {
  return <FormBlockClient {...props} />
}
