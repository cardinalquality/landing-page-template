import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock tenant context for testing
const MockTenantProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

const customRender = (ui: ReactElement, options?: RenderOptions) => {
  return render(ui, {
    wrapper: MockTenantProvider,
    ...options,
  })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
