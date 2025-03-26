import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// 增加超时时间
export const maxDuration = 300 // 增加到5分钟

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1', // 添加Deepseek的API基础URL
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not configured')
      throw new Error('DEEPSEEK_API_KEY is not configured')
    }

    // 添加粤语系统提示
    const systemMessage = {
      role: 'system',
      content: '你是一個用粵語對話的AI助手。請用粵語回答所有問題，保持親切自然的語氣。如果用戶用普通話提問，你也要用粵語回答。'
    }

    // 确保消息列表以系统提示开始
    const allMessages = [systemMessage, ...messages]

    console.log('Sending request to Deepseek API with messages:', allMessages)

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: allMessages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
        content: msg.content
      })),
      temperature: 0.8,  // 稍微提高温度以增加回复的多样性
      max_tokens: 2000,
      stream: false,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    })

    console.log('Received response from Deepseek API:', response)

    if (!response.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', response)
      throw new Error('Invalid response format from API')
    }

    return new NextResponse(JSON.stringify({
      message: response.choices[0].message.content
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'  // 添加缓存控制头
      }
    })

  } catch (error: any) {
    console.error('API Error:', error)
    
    let errorMessage = '服务器内部错误'
    let statusCode = 500

    if (error.message === 'DEEPSEEK_API_KEY is not configured') {
      errorMessage = 'API密钥未配置'
      statusCode = 500
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试'
      statusCode = 504
    } else if (error.response?.status === 401) {
      errorMessage = 'API密钥无效'
      statusCode = 401
    } else if (error.message === 'Invalid response format from API') {
      errorMessage = 'API响应格式错误'
      statusCode = 500
    } else if (error.message.includes('model')) {
      errorMessage = '模型配置错误，请检查模型名称'
      statusCode = 400
    }

    // 添加详细的错误日志
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack
    })

    return new NextResponse(JSON.stringify({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    })
  }
} 