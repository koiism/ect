'use client'

import React, { useState } from 'react'
import { useField, TextareaField, Button, useLocale } from '@payloadcms/ui'

const AutoSummaryField: React.FC<{
  path: string
  field: {
    label?: string
    required?: boolean
    name: string
  }
}> = (props) => {
  const { path } = props
  const { value, setValue } = useField<string>({ path })
  const [isGenerating, setIsGenerating] = useState(false)
  const { value: description } = useField<string>({ path: 'description' })
  const locale = useLocale()

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)

      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description || '',
          locale: locale.code
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '生成摘要失败')
      }

      if (data.content) {
        setValue(data.content.trim())
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={handleGenerate} disabled={Boolean(isGenerating || !description)}>
          {isGenerating ? '生成中...' : '自动生成简介'}
        </Button>
      </div>
      <TextareaField {...props} />
    </div>
  )
}

export default AutoSummaryField
