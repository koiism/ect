'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import type { FormData, FormStepProps } from '../types'
import { capitalCase } from 'change-case'

export const ReviewStep: React.FC<FormStepProps> = ({ forms = [] }) => {
  const { getValues } = useFormContext<FormData>()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Order</h2>
      <div className="rounded-lg p-6 space-y-2 md:space-y-4">
        <div>
          <h3 className="font-medium">Contact Information</h3>
          <p className="text-gray-600">{getValues('email')}</p>
        </div>
        {forms.map((form, index) => (
          <div key={index}>
            <h3 className="font-medium">
              {form.type} #{form.index}
            </h3>
            <div className="grid gap-0 md:gap-2 sm:grid-cols-2">
              {Object.entries(getValues(`forms.${index}`)).map(([key, value]) => (
                <div key={key}>
                  <span className="text-gray-600">{capitalCase(key)}: </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
