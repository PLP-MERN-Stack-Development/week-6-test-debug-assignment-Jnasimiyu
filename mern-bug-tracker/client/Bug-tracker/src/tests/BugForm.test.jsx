/**
 * Unit tests for BugForm component
 */
import React from 'react'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import BugForm from '../components/BugForm'
import { BugProvider } from '../context/BugContext'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: undefined }) // default to create mode
  }
})

// Mock bugService
vi.mock('../services/bugService', () => ({
  default: {
    createBug: vi.fn(),
    updateBug: vi.fn(),
    getBugById: vi.fn()
  }
}))

const renderBugForm = () =>
  render(
    <BrowserRouter>
      <BugProvider>
        <BugForm />
      </BugProvider>
    </BrowserRouter>
  )

describe('BugForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders all form fields', () => {
    renderBugForm()
    expect(screen.getByLabelText(/bug title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/severity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/reported by/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/assigned to/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/add a tag/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/reproduction steps/i)).toBeInTheDocument()
  })

  test('shows validation errors when submitting empty form', async () => {
    renderBugForm()
    fireEvent.click(screen.getByRole('button', { name: /create bug/i }))

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument()
    })
  })

  test('validates min length of title and description', async () => {
    renderBugForm()

    fireEvent.change(screen.getByLabelText(/bug title/i), { target: { value: 'AB' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /create bug/i }))

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  test('adds and removes tags', async () => {
    renderBugForm()
    const tagInput = screen.getByPlaceholderText(/add a tag/i)
    fireEvent.change(tagInput, { target: { value: 'frontend' } })
    fireEvent.click(screen.getAllByRole('button')[0]) // add tag button

    expect(screen.getByText('frontend')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button')[1]) // remove tag
    expect(screen.queryByText('frontend')).not.toBeInTheDocument()
  })

  test('form submission navigates on success', async () => {
    renderBugForm()
    fireEvent.change(screen.getByLabelText(/bug title/i), { target: { value: 'Test Bug' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a valid bug description' } })
    fireEvent.change(screen.getByLabelText(/reported by/i), { target: { value: 'John Doe' } })
    fireEvent.click(screen.getByRole('button', { name: /create bug/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  test('character count updates in description', () => {
    renderBugForm()
    const input = screen.getByLabelText(/description/i)
    fireEvent.change(input, { target: { value: 'testing description' } })
    expect(screen.getByText('20/1000 characters')).toBeInTheDocument()
  })

  test('cancel button navigates back', () => {
    renderBugForm()
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('shows loading text during submission', async () => {
    renderBugForm()
    fireEvent.change(screen.getByLabelText(/bug title/i), { target: { value: 'Title' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Valid description here' } })
    fireEvent.change(screen.getByLabelText(/reported by/i), { target: { value: 'User' } })
    fireEvent.click(screen.getByRole('button', { name: /create bug/i }))

    expect(screen.getByText(/saving.../i)).toBeInTheDocument()
  })

  test('renders edit mode if ID is present in params', async () => {
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '123' })
      }
    })

    renderBugForm()

    await waitFor(() => {
      expect(screen.getByText(/edit bug report/i)).toBeInTheDocument()
    })
  })
})
