'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '../providers'
import './styles.css'

export default function ThemeTest() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        主题切换测试页面
      </h1>

      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-8"
      >
        切换到{theme === 'light' ? '深色' : '浅色'}主题
      </button>

      {/* CSS 变量测试块 */}
      <div className="theme-test-block mb-4">
        这是使用 CSS 变量的测试块
      </div>

      {/* Tailwind 测试块 */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <p className="text-gray-900 dark:text-white">
          这是使用 Tailwind 类的测试块
        </p>
      </div>

      {/* 状态显示 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-900 dark:text-white">当前主题: {theme}</p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Dark 类是否存在: {document.documentElement.classList.contains('dark') ? '是' : '否'}
        </p>
      </div>
    </div>
  )
} 