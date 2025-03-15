import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    console.log('API Key 是否存在:', !!process.env.DEEPSEEK_API_KEY);
    console.log('API Key 前几位:', process.env.DEEPSEEK_API_KEY?.substring(0, 5));

    const { messages } = await req.json()

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一個友善的AI助手，請用粵語和繁體中文回答問題。"
          },
          ...messages
        ]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('API 响应详情:', {
        status: response.status,
        statusText: response.statusText,
        error: error
      });
      throw new Error(error.message || '請求失敗')
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('無效的 API 響應')
    }

    return NextResponse.json({
      message: data.choices[0].message.content
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '對唔住，暫時未能處理你嘅請求' },
      { status: 500 }
    )
  }
} 