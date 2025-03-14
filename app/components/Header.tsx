'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../providers'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const menuItems = [
    { href: '/', label: '首頁' },
    { href: '/chat', label: 'AI 對話' },
    { href: '/about', label: '關於' },
  ]

  return (
    <>
      {/* Full Page Menu Overlay */}
      <div 
        className={`fixed inset-0 transition-all duration-300 ${
          isMenuOpen 
            ? 'opacity-100 pointer-events-auto z-[60]' 
            : 'opacity-0 pointer-events-none -z-10'
        }`}
        style={{ 
          backgroundColor: 'rgba(214, 0, 50, 0.9)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        }}
      >
        {/* Close Button in Overlay */}
        <div className="container mx-auto px-6">
          <div className="flex justify-end py-6">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-gray-200 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Menu Container with Flex Column */}
        <div className="relative container mx-auto px-6 h-[calc(100vh-96px)] flex flex-col justify-between">
          {/* Menu Items - Aligned Left */}
          <div className="flex flex-col items-start mt-12 space-y-12">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="group relative text-3xl font-light text-white transition-colors duration-200"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-white transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* Footer Text */}
          <div className="mb-12 flex flex-col space-y-2">
            <p className="text-sm font-light text-white/80">
              © Copyright 2025. 设计师，交易员，探索者
            </p>
            <p className="text-sm font-light text-white/80">
              粤ICP备2024348713号-1
            </p>
          </div>
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between py-6">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center"
            >
              <Image
                src={theme === 'dark' ? '/logo-revert.svg' : '/logo.svg'}
                alt="Logo"
                width={100}
                height={100}
                priority
                className="transition-all duration-300"
              />
            </Link>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-6">
              {/* Menu Button */}
              <button
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={24} />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}