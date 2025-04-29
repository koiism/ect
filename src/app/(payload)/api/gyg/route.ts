import { NextResponse } from 'next/server'
import { sendTestEmail } from '@/utilities/emailUtils'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    await sendTestEmail(payload)
    return NextResponse.json({ message: '发送成功' })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json({ error: '生成描述时发生错误' }, { status: 500 })
  }
}
