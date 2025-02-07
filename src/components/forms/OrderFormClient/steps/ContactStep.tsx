'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormData } from '../types'

export const ContactStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>()

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Contact Information</h2>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Please enter your email"
          className="max-w-md"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email format',
            },
          })}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
    </div>
  )
}
