export default function Footer() {
  return (
    <footer className="border-t py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm dark:border-gray-800">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        © Copyright {new Date().getFullYear()} 设计师，交易员，探索者
      </div>
      <div className="container mx-auto px-4 text-center text-xs font-light text-gray-400 dark:text-gray-500">
        粤ICP备2024348713号-1
      </div>
    </footer>
  )
} 