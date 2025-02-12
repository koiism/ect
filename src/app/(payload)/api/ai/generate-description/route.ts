import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { generateOpenAIChatCompletion } from '@/plugins/seo/utils/generateOpenAIChatCompletion'

export async function POST(request: Request) {
  try {
    const { description, highlights, importantInfo } = await request.json()

    if (!description) {
      return NextResponse.json({ error: '缺少必要的描述参数' }, { status: 400 })
    }

    const body: OpenAI.Chat.ChatCompletionCreateParams = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的旅游产品文案专家。请根据提供的产品信息，生成以下内容：

          1. 产品详细描述：
          - 至少500字的详细描述
          - 包含产品的主要特点、行程安排、体验价值等
          - 使用专业但易懂的语言
          - 注重实用信息和体验描述

          2. 产品亮点：
          - 3-5个产品的主要亮点
          - 每个亮点应简洁明了
          - 突出独特卖点和价值主张
          - 当前已有产品亮点如下：${highlights}

          3. 重要信息：
          - 2-3个重要信息类别
          - 每个类别包含相关的具体说明
          - 涵盖预订须知、使用说明等关键信息
          - 当前已有重要信息如下：${importantInfo}

          请以JSON格式返回，格式如下，除了返回的JSON之外不要返回其他任何内容：
          {
            "description": "产品详细描述文本",
            "highlights": [
              { "text": "亮点1" },
              { "text": "亮点2" }
            ],
            "importantInfo": [
              {
                "title": "类别1",
                "content": [
                  { "text": "说明1" },
                  { "text": "说明2" }
                ]
              }
            ]
          }`,
        },
        {
          role: 'user',
          content: description,
        },
      ],
      stream: false,
    }

    const result = await generateOpenAIChatCompletion(body)
    const content = JSON.parse(result.trim())

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: '生成描述时发生错误' },
      { status: 500 }
    )
  }
}
