'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

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

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShouldScroll(true) // 发送消息时设置滚动标志

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message
      }])
      setShouldScroll(true) // AI 回复时设置滚动标志
    } catch (error) {
      console.error('Error:', error)
      // 可以添加错误提示
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* 介绍文字部分 - 添加标题 */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          AI聊天 - Powered by Deepseek
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl text-sm sm:text-base">
          這是我第一次嘗試用AI搭建的網站，裡面都是用到了我以前未曾接觸過的技術，比如用了next.js架構、嵌入API、svg圖片；最重要的是在搭建的整個過程，我都沒有敲打過一個代碼，以此紀念AI對於創作過程的改變。
          <span className="block mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">2025年3月</span>
        </p>
      </div>

      {/* 对话框部分 - 修改高度计算和滚动行为 */}
      <div className="mx-auto w-full sm:w-[600px] lg:w-[800px] 
                      flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg 
                      mb-6 max-w-full px-2 sm:px-0 h-[calc(100vh-300px)] min-h-[400px] max-h-[700px]">
        {/* 消息列表 - 修改滚动行为 */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 scrollbar-thin 
                        scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
                        scrollbar-track-transparent">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } items-end space-x-2`}
            >
              {message.role === 'assistant' && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 mr-2">
                  AI
                </span>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
                  message.role === 'user'
                    ? 'bg-[#D60032] text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose dark:prose-invert max-w-none prose-sm">
                    <ReactMarkdown
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ 
                                margin: 0,
                                fontSize: '0.8rem',
                                maxWidth: '100%',
                                overflowX: 'auto'
                              }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code {...props} className="text-sm">
                              {children}
                            </code>
                          )
                        },
                        p: ({children}) => <p className="mb-2 last:mb-0 text-sm sm:text-base">{children}</p>,
                        ul: ({children}) => <ul className="list-disc pl-4 mb-2 text-sm sm:text-base">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-4 mb-2 text-sm sm:text-base">{children}</ol>,
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
                  <span className="text-sm sm:text-base">{message.content}</span>
                )}
              </div>
              {message.role === 'user' && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 ml-2">
                  我
                </span>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-end space-x-2">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 mr-2">
                AI
              </span>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-200">
                正在思考...
              </div>
            </div>
          )}
          {/* 添加用于滚动的空div */}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框部分 - 更新深色主题背景色 */}
        <div className="p-2 sm:p-4 bg-[#D60032] dark:bg-[rgb(22,33,57)]">
          <div className="flex space-x-2 sm:space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="輸入訊息..."
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg border-0 bg-white text-gray-900 placeholder-gray-500 outline-none focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className={`px-4 sm:px-6 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base
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