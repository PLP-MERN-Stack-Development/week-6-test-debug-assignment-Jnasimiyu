import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

test('renders Bug Tracker heading', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  expect(screen.getByText(/bug tracker/i)).toBeInTheDocument()
})
