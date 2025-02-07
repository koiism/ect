import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import React from 'react'
import RichText from '@/components/RichText'
import { FormBlockActions } from './FormBlockActions'

export type FormBlockProps = {
  id?: string
  enableIntro: boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
}

export const FormBlock = (props: FormBlockProps) => {
  const {
    enableIntro,
    form,
    introContent,
  } = props

  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && (
        <RichText className="mb-8 lg:mb-12" content={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormBlockActions form={form} />
      </div>
    </div>
  )
}
