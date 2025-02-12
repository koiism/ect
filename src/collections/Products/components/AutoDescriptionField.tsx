'use client'

import React, { useState } from 'react'
import { useField, TextareaField, Button, useLocale } from '@payloadcms/ui'

interface GeneratedContent {
  description: string
  highlights: Array<{ text: string }>
  importantInfo: Array<{
    title: string
    content: Array<{ text: string }>
  }>
}

const AutoDescriptionField: React.FC<{
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
  const { value: highlights, setValue: setHighlights } = useField({ path: 'highlights' })
  const { value: importantInfo, setValue: setImportantInfo } = useField({ path: 'importantInfo' })
  const locale = useLocale()

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)

      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: value || '',
          highlights,
          importantInfo,
          locale: locale.code,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '生成内容失败')
      }

      if (data.content) {
        const content: GeneratedContent = data.content
        setValue(content.description)
        setHighlights(content.highlights)
        setImportantInfo(content.importantInfo)
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? '生成中...' : '自动生成内容'}
        </Button>
      </div>
      <TextareaField {...props} />
    </div>
  )
}

export default AutoDescriptionField
