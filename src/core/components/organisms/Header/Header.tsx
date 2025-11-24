'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/core/stores/cart'
import { getTenantConfig } from '@/tenants/config'

export function Header() {
  const tenant = getTenantConfig('eonlife')!
  const itemCount = useCartStore((state) => state.itemCount)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-48">
              <Image
                src={tenant.theme.logo}
                alt={tenant.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#products"
              className="text-gray-700 hover:text-[#8B7355] transition-colors font-medium"
            >
              Products
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-[#8B7355] transition-colors font-medium"
            >
              About
            </a>
          </nav>

          {/* Cart Icon */}
          <button
            onClick={() => {
              // Will open cart sidebar
              console.log('Open cart')
            }}
            className="relative p-2 text-gray-700 hover:text-[#8B7355] transition-colors"
          >
            {/* Shopping Cart SVG Icon */}
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            {/* Cart Count Badge */}
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4A574] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
