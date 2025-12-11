/**
 * LanguageSwitcher Component Tests
 *
 * Tests the language switcher dropdown component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: vi.fn(),
}))

// Mock i18n navigation
vi.mock('@/i18n/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}))

describe('LanguageSwitcher', () => {
  const mockPush = vi.fn()
  const mockReplace = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLocale).mockReturnValue('en')
    vi.mocked(usePathname).mockReturnValue('/')
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    } as any)
  })

  it('renders the current language flag and code', () => {
    render(<LanguageSwitcher />)

    // Should show US flag and EN code for English
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    expect(screen.getByText(/EN/i)).toBeInTheDocument()
  })

  it('shows dropdown when clicked', () => {
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should show both language options
    expect(screen.getByText(/English/i)).toBeInTheDocument()
    expect(screen.getByText(/Español/i)).toBeInTheDocument()
  })

  it('highlights the current language in dropdown', () => {
    vi.mocked(useLocale).mockReturnValue('es')
    render(<LanguageSwitcher />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Spanish option should be marked as current
    const spanishOption = screen.getByText(/Español/i).closest('button')
    expect(spanishOption).toHaveClass('bg-gray-100')
  })

  it('switches language when option is clicked', () => {
    render(<LanguageSwitcher />)

    // Open dropdown
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    // Click Spanish option
    const spanishOption = screen.getByText(/Español/i)
    fireEvent.click(spanishOption)

    // Should navigate to Spanish version
    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'es' })
  })

  it('closes dropdown after selecting a language', () => {
    render(<LanguageSwitcher />)

    // Open dropdown
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    // Dropdown should be visible
    expect(screen.getByText(/English/i)).toBeInTheDocument()

    // Click a language
    const englishOption = screen.getByText(/English/i)
    fireEvent.click(englishOption)

    // Dropdown should close (English option no longer visible as dropdown item)
    expect(screen.queryByText(/Español/i)).not.toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <LanguageSwitcher />
        <div data-testid="outside">Outside</div>
      </div>
    )

    // Open dropdown
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    // Dropdown should be visible
    expect(screen.getByText(/English/i)).toBeInTheDocument()

    // Click outside
    const outside = screen.getByTestId('outside')
    fireEvent.mouseDown(outside)

    // Dropdown should close
    expect(screen.queryByText(/Español/i)).not.toBeInTheDocument()
  })

  it('shows Spanish flag when locale is es', () => {
    vi.mocked(useLocale).mockReturnValue('es')
    render(<LanguageSwitcher />)

    // Should show Spanish flag and ES code
    expect(screen.getByText('🇪🇸')).toBeInTheDocument()
    expect(screen.getByText(/ES/i)).toBeInTheDocument()
  })

  it('preserves current pathname when switching languages', () => {
    vi.mocked(usePathname).mockReturnValue('/privacy')
    render(<LanguageSwitcher />)

    // Open dropdown and switch to Spanish
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    const spanishOption = screen.getByText(/Español/i)
    fireEvent.click(spanishOption)

    // Should navigate to /es/privacy (preserving /privacy path)
    expect(mockReplace).toHaveBeenCalledWith('/privacy', { locale: 'es' })
  })
})
