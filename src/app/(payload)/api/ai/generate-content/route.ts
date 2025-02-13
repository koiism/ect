import { NextResponse } from 'next/server'
import { generateOpenAIChatCompletion } from '@/plugins/seo/utils/generateOpenAIChatCompletion'
import { generatePromptMap } from '@/utilities/generatePrompts'

export async function POST(request: Request) {
  try {
    const { type, ...generateParams } = await request.json()

    const genPromptFn = generatePromptMap[type as keyof typeof generatePromptMap]
    const body = genPromptFn(generateParams)

    const result = await generateOpenAIChatCompletion(body)
    const content = JSON.parse(result.trim())

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json({ error: '生成描述时发生错误' }, { status: 500 })
  }
}
