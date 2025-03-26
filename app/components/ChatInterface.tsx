'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Prism from 'react-syntax-highlighter/dist/cjs/prism'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 只在新消息添加时触发滚动
  useEffect(() => {
    if (shouldScroll) {
      scrollToBottom()
      setShouldScroll(false)
    }
  }, [shouldScroll])

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShouldScroll(true)

    try {
      console.log('Sending request to API with messages:', [...messages, userMessage])
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
        // 添加超时设置
        signal: AbortSignal.timeout(300000) // 5分钟超时
      })

      console.log('Received response:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error response:', errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Parsed response data:', data)
      
      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.message) {
        throw new Error('Invalid response format')
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message
      }])
      setShouldScroll(true)
    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `抱歉，發生了錯誤：${error.message || '未知錯誤'}`
      }])
      setShouldScroll(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* 介绍文字部分 */}
      <div className="w-full mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          AI聊天 - Powered by Deepseek
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
          這是我第一次嘗試用AI搭建的網站，裡面都是用到了我以前未曾接觸過的技術，比如用了next.js架構、嵌入API、svg圖片；最重要的是在搭建的整個過程，我都沒有敲打過一個代碼，以此紀念AI對於創作過程的改變。
          <span className="block mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400">2025年3月</span>
        </p>
      </div>

      {/* 对话框部分 */}
      <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg mb-6">
        {/* 消息列表 */}
        <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } items-end space-x-2`}
            >
              {message.role === 'assistant' && (
                <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-1 mr-2">
                  AI
                </span>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-2 sm:px-5 sm:py-3 ${
                  message.role === 'user'
                    ? 'bg-[#D60032] text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        code({className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return match ? (
                            <pre className={`language-${match[1]}`}>
                              <code {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        },
                        p: ({children}) => <p className="mb-2 last:mb-0 text-base sm:text-lg">{children}</p>,
                        ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-base sm:text-lg">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-base sm:text-lg">{children}</ol>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                        a: ({href, children}) => (
                          <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-base sm:text-lg">{message.content}</span>
                )}
              </div>
              {message.role === 'user' && (
                <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-1 ml-2">
                  我
                </span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-end space-x-2">
              <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-1 mr-2">
                AI
              </span>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 sm:px-5 sm:py-3 text-base sm:text-lg text-gray-700 dark:text-gray-200">
                正在思考...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框部分 */}
        <div className="p-4 sm:p-6 bg-[#D60032] dark:bg-[rgb(22,33,57)] rounded-b-lg">
          <div className="flex space-x-3 sm:space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="輸入訊息..."
              className="flex-1 px-4 py-2 sm:px-5 sm:py-3 text-base sm:text-lg rounded-lg border-0 bg-white text-gray-900 placeholder-gray-500 outline-none focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-colors font-medium text-base sm:text-lg
                ${!input.trim() 
                  ? 'bg-[#C1272D] text-white' 
                  : 'bg-white text-[#D60032] dark:text-[rgb(22,33,57)] hover:bg-gray-100'
                } 
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              發送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 