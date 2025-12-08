'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTenantConfig } from '@/tenants/config'

/**
 * Cookie Consent Banner
 *
 * GDPR/CCPA compliant cookie consent banner.
 * Displays on first visit and stores user preference in localStorage.
 */
export function CookieConsent() {
  const tenant = getTenantConfig('eonlife')!
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  const acceptCustom = (preferences: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!showDetails ? (
          // Simple Banner
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2" style={{ color: tenant.theme.primaryColor }}>
                🍪 We value your privacy
              </h3>
              <p className="text-sm text-gray-600">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                By clicking "Accept All," you consent to our use of cookies.{' '}
                <Link href="/privacy" className="underline hover:text-gray-900">
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm border-2 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: tenant.theme.primaryColor, color: tenant.theme.primaryColor }}
              >
                Cookie Settings
              </button>
              <button
                onClick={acceptNecessary}
                className="px-4 py-2 text-sm border-2 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: tenant.theme.primaryColor, color: tenant.theme.primaryColor }}
              >
                Necessary Only
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: tenant.theme.accentColor }}
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          // Detailed Settings
          <CookieSettings
            onAccept={acceptCustom}
            onBack={() => setShowDetails(false)}
            tenant={tenant}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Cookie Settings Component
 * Allows users to customize cookie preferences
 */
function CookieSettings({
  onAccept,
  onBack,
  tenant,
}: {
  onAccept: (preferences: { necessary: boolean; analytics: boolean; marketing: boolean }) => void
  onBack: () => void
  tenant: any
}) {
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: tenant.theme.primaryColor }}>
          Cookie Preferences
        </h3>
        <button
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-4">
        {/* Necessary Cookies */}
        <div className="border-2 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Necessary Cookies</h4>
            <span className="text-sm text-gray-500 font-medium">Always Active</span>
          </div>
          <p className="text-sm text-gray-600">
            These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.
          </p>
        </div>

        {/* Analytics Cookies */}
        <div className="border-2 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Analytics Cookies</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600">
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
          </p>
        </div>

        {/* Marketing Cookies */}
        <div className="border-2 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Marketing Cookies</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-600">
            These cookies are used to track visitors across websites and display ads that are relevant and engaging for the individual user.
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onAccept(preferences)}
          className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: tenant.theme.accentColor }}
        >
          Save Preferences
        </button>
        <button
          onClick={() => onAccept({ necessary: true, analytics: true, marketing: true })}
          className="flex-1 px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ borderColor: tenant.theme.primaryColor, color: tenant.theme.primaryColor }}
        >
          Accept All
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Learn more about our cookie policy in our{' '}
        <Link href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
