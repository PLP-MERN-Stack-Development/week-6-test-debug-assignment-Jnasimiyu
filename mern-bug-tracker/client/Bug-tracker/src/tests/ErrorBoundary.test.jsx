/**
 * Unit tests for ErrorBoundary component
 */
import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest';

import ErrorBoundary from '../components/ErrorBoundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    reload: vi.fn(),
    href: ''
  },
  writable: true
})

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for these tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  test('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/we're sorry for the inconvenience/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument()
  })

  test('reload button triggers window.location.reload', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const reloadButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(reloadButton)

    expect(window.location.reload).toHaveBeenCalled()
  })

  test('go home button navigates to home', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const homeButton = screen.getByRole('button', { name: /go home/i })
    fireEvent.click(homeButton)

    expect(window.location.href).toBe('/')
  })

  test('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/error details/i)).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  test('does not show error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText(/error details/i)).not.toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })
})