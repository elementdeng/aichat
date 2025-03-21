import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// 增加超时时间
export const runtime = 'edge' // 使用 Edge Runtime
export const maxDuration = 300 // 增加到5分钟

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  timeout: 300000, // 增加到5分钟
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",  // 使用 Deepseek 模型
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false, // 确保不使用流式响应
    })

    // 确保返回格式正确
    return new NextResponse(JSON.stringify({
      message: response.choices[0].message.content
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })

  } catch (error: any) {
    console.error('API Error:', error)
    
    let errorMessage = '服务器内部错误'
    let statusCode = 500

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试'
      statusCode = 504
    }

    return new NextResponse(JSON.stringify({
      error: errorMessage
    }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
} 