'use client'

import React, { useState } from 'react'
import { useField, Button, useLocale } from '@payloadcms/ui'
import { Textarea } from '@/components/ui/textarea'
import { IProductPromptParams } from '@/utilities/generatePrompts'
import { Product } from '@/payload-types'

interface GeneratedContent {
  title: string
  summary: string
  description: string
  highlights: Array<{ text: string }>
  includes: Array<{ text: string }>
  excludes: Array<{ text: string }>
  importantInfo: Array<{
    title: string
    content: Array<{ text: string }>
  }>
  meta: {
    title: string
    description: string
    keywords: Array<{ keyword: string }>
  }
}

interface FieldState {
  title: Product['title']
  summary: Product['summary']
  description: Product['description']
  highlights: Product['highlights']
  includes: Product['includes']
  excludes: Product['excludes']
  importantInfo: Product['importantInfo']
  meta: Product['meta']
}

const AutoDescriptionField: React.FC<{}> = (props) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [seedContent, setSeedContent] = useState('')
  const [previewContent, setPreviewContent] = useState<GeneratedContent | null>(null)
  const [previousState, setPreviousState] = useState<FieldState | null>(null)

  const { value: title, setValue: setTitle } = useField<Product['title']>({
    path: 'title',
  })
  const { value: summary, setValue: setSummary } = useField<Product['summary']>({
    path: 'summary',
  })
  const { value: description, setValue: setDescription } = useField<Product['description']>({
    path: 'description',
  })
  const { value: highlights, setValue: setHighlights } = useField<Product['highlights']>({
    path: 'highlights',
  })
  const { value: includes, setValue: setIncludes } = useField<Product['includes']>({
    path: 'includes',
  })
  const { value: excludes, setValue: setExcludes } = useField<Product['excludes']>({
    path: 'excludes',
  })
  const { value: importantInfo, setValue: setImportantInfo } = useField<Product['importantInfo']>({
    path: 'importantInfo',
  })
  const { value: meta, setValue: setMeta } = useField<Product['meta']>({
    path: 'meta',
  })
  const locale = useLocale()

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)

      const body: IProductPromptParams = {
        type: 'product',
        seedContent,
        title,
        summary,
        description,
        highlights,
        includes,
        excludes,
        importantInfo,
        meta,
        locale: locale.code,
      }

      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '生成内容失败')
      }

      if (data.content) {
        setPreviewContent(data.content)
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApply = () => {
    if (!previewContent) return

    // 保存当前状态用于撤销
    setPreviousState({
      title,
      summary,
      description,
      highlights,
      includes,
      excludes,
      importantInfo,
      meta,
    })

    // 应用新内容
    setTitle(previewContent.title)
    setSummary(previewContent.summary)
    setDescription(previewContent.description)
    setHighlights(previewContent.highlights)
    setIncludes(previewContent.includes)
    setExcludes(previewContent.excludes)
    setImportantInfo(previewContent.importantInfo)
    setMeta(previewContent.meta)

    // 清除预览
    setPreviewContent(null)
  }

  const handleUndo = () => {
    if (!previousState) return

    // 恢复之前的状态
    setTitle(previousState.title)
    setSummary(previousState.summary)
    setDescription(previousState.description)
    setHighlights(previousState.highlights)
    setIncludes(previousState.includes)
    setExcludes(previousState.excludes)
    setImportantInfo(previousState.importantInfo)
    setMeta(previousState.meta)

    // 清除之前的状态
    setPreviousState(null)
  }

  const renderPreview = () => {
    if (!previewContent) return null

    return (
      <div className="mt-4 border p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">预览内容</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold">标题</h4>
            <div className="mt-1">{previewContent.title}</div>
          </div>

          <div>
            <h4 className="font-bold">简介</h4>
            <div className="mt-1">{previewContent.summary}</div>
          </div>

          <div>
            <h4 className="font-bold">详细描述</h4>
            <div className="mt-1 whitespace-pre-wrap">{previewContent.description}</div>
          </div>

          <div>
            <h4 className="font-bold">产品亮点</h4>
            <ul className="mt-1 list-disc pl-4">
              {previewContent.highlights.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">包含内容</h4>
            <ul className="mt-1 list-disc pl-4">
              {previewContent.includes.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">不包含内容</h4>
            <ul className="mt-1 list-disc pl-4">
              {previewContent.excludes.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold">重要信息</h4>
            <div className="mt-1 space-y-2">
              {previewContent.importantInfo.map((section, index) => (
                <div key={index}>
                  <h5 className="font-semibold">{section.title}</h5>
                  <ul className="list-disc pl-4">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex}>{item.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold">SEO信息</h4>
            <div className="mt-1 space-y-2">
              <div>
                <h5 className="font-semibold">Meta标题</h5>
                <div>{previewContent.meta.title}</div>
              </div>
              <div>
                <h5 className="font-semibold">Meta描述</h5>
                <div>{previewContent.meta.description}</div>
              </div>
              <div>
                <h5 className="font-semibold">关键词</h5>
                <ul className="list-disc pl-4">
                  {previewContent.meta.keywords.map((item, index) => (
                    <li key={index}>{item.keyword}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-x-4">
          <Button onClick={handleApply}>应用更改</Button>
          <Button onClick={() => setPreviewContent(null)}>取消</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Textarea
          className='resize-y'
          value={seedContent}
          onChange={(e) => setSeedContent(e.target.value)}
          placeholder="请输入产品相关信息,AI将帮助你生成完整的产品内容"
        />
        <div className="mt-2 space-x-4">
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? '生成中...' : '根据上面的内容自动生成产品'}
          </Button>
          {previousState && (
            <Button onClick={handleUndo}>撤销更改</Button>
          )}
        </div>
      </div>

      {renderPreview()}
    </div>
  )
}

export default AutoDescriptionField
