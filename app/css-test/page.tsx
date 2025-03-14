'use client'

export default function CSSTest() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">CSS 测试页面</h1>
      
      {/* Tailwind 基础类测试 */}
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-blue-500 text-white rounded">
          这是蓝色背景白色文字
        </div>
        <div className="p-4 bg-green-500 text-white rounded">
          这是绿色背景白色文字
        </div>
        <div className="p-4 bg-red-500 text-white rounded">
          这是红色背景白色文字
        </div>
      </div>

      {/* Flexbox 测试 */}
      <div className="flex space-x-4 mb-8">
        <div className="p-4 bg-gray-200 rounded">Flex 项目 1</div>
        <div className="p-4 bg-gray-200 rounded">Flex 项目 2</div>
        <div className="p-4 bg-gray-200 rounded">Flex 项目 3</div>
      </div>

      {/* Grid 测试 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gray-200 rounded">Grid 项目 1</div>
        <div className="p-4 bg-gray-200 rounded">Grid 项目 2</div>
        <div className="p-4 bg-gray-200 rounded">Grid 项目 3</div>
      </div>

      {/* 响应式设计测试 */}
      <div className="bg-purple-500 text-white p-4 rounded mb-8">
        <p className="hidden sm:block">在小屏幕上隐藏，中等屏幕上显示</p>
        <p className="block sm:hidden">在小屏幕上显示，中等屏幕上隐藏</p>
      </div>

      {/* 动画效果测试 */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
        悬停查看效果
      </button>
    </div>
  )
} 