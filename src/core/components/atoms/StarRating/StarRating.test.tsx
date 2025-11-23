import { describe, it, expect } from 'vitest'
import { render, screen } from '@/core/lib/test-utils'
import { StarRating } from './StarRating'

describe('StarRating', () => {
  // Rendering tests
  it('renders with correct number of stars', () => {
    const { container } = render(<StarRating rating={0} />)
    const stars = container.querySelectorAll('[data-testid="star"]')
    expect(stars).toHaveLength(5) // Always show 5 stars
  })

  it('renders full stars for whole ratings', () => {
    const { container } = render(<StarRating rating={4} />)
    const filledStars = container.querySelectorAll('[data-filled="true"]')
    expect(filledStars).toHaveLength(4)
  })

  it('renders half stars for decimal ratings', () => {
    const { container } = render(<StarRating rating={3.5} />)
    const halfStars = container.querySelectorAll('[data-half="true"]')
    expect(halfStars).toHaveLength(1)
  })

  it('renders empty stars for remaining', () => {
    const { container } = render(<StarRating rating={2} />)
    const emptyStars = container.querySelectorAll('[data-filled="false"]')
    expect(emptyStars).toHaveLength(3)
  })

  // Size variants
  it('applies small size styles', () => {
    const { container } = render(<StarRating rating={5} size="sm" />)
    const star = container.querySelector('[data-testid="star"]')
    expect(star).toHaveClass('w-4', 'h-4')
  })

  it('applies medium size styles by default', () => {
    const { container } = render(<StarRating rating={5} />)
    const star = container.querySelector('[data-testid="star"]')
    expect(star).toHaveClass('w-5', 'h-5')
  })

  it('applies large size styles', () => {
    const { container} = render(<StarRating rating={5} size="lg" />)
    const star = container.querySelector('[data-testid="star"]')
    expect(star).toHaveClass('w-6', 'h-6')
  })

  // Edge cases
  it('handles rating of 0', () => {
    const { container } = render(<StarRating rating={0} />)
    const filledStars = container.querySelectorAll('[data-filled="true"]')
    expect(filledStars).toHaveLength(0)
  })

  it('handles rating of 5', () => {
    const { container } = render(<StarRating rating={5} />)
    const filledStars = container.querySelectorAll('[data-filled="true"]')
    expect(filledStars).toHaveLength(5)
  })

  it('clamps rating above 5 to 5', () => {
    const { container } = render(<StarRating rating={10} />)
    const filledStars = container.querySelectorAll('[data-filled="true"]')
    expect(filledStars).toHaveLength(5)
  })

  it('clamps negative rating to 0', () => {
    const { container } = render(<StarRating rating={-1} />)
    const filledStars = container.querySelectorAll('[data-filled="true"]')
    expect(filledStars).toHaveLength(0)
  })

  // Accessibility
  it('has accessible label', () => {
    render(<StarRating rating={4.5} />)
    expect(screen.getByLabelText(/4\.5 out of 5 stars/i)).toBeInTheDocument()
  })

  it('accepts custom className', () => {
    const { container } = render(<StarRating rating={5} className="custom-class" />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('custom-class')
  })
})
