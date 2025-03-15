import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    apiKeyExists: !!process.env.DEEPSEEK_API_KEY,
    apiKeyPrefix: process.env.DEEPSEEK_API_KEY?.substring(0, 5)
  })
} 