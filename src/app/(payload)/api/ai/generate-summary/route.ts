import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { generateOpenAIChatCompletion } from '@/plugins/seo/utils/generateOpenAIChatCompletion'

export async function POST(request: Request) {
  try {
    const { description, locale } = await request.json()

    if (!description) {
      return NextResponse.json({ error: '缺少必要的描述参数' }, { status: 400 })
    }

    const body: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的旅游产品文案专家。请根据提供的产品详细描述，生成一个不超过200字的产品简介。
          简介应该：
          - 突出产品的主要特点和价值
          - 使用吸引人但专业的语言
          - 避免过度营销的语气
          - 包含关键的实用信息
          - 确保内容准确且有吸引力
          - 使用ISO-2代码"${locale}"指定的语言编写。

          请直接返回简介文本，不要包含任何其他内容。`,
        },
        {
          role: 'user',
          content: description,
        },
      ],
      stream: false,
    }

    const result = await generateOpenAIChatCompletion(body)

    return NextResponse.json({ content: result })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: '生成摘要时发生错误' },
      { status: 500 }
    )
  }
}
