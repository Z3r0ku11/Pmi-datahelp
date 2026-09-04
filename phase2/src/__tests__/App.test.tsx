import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock the auth service
vi.mock('@shared/utils/auth', () => ({
  AuthService: {
    getStoredToken: () => null,
    getStoredUser: () => null,
    isTokenExpired: () => true,
    clearAuth: vi.fn(),
  }
}))

describe('Phase 2 App', () => {
  it('renders login screen when not authenticated', () => {
    render(<App />)
    expect(screen.getByText('Acceso Ejecutivo')).toBeInTheDocument()
  })

  it('shows corporate login option', () => {
    render(<App />)
    expect(screen.getByText('Acceso Corporativo Morris')).toBeInTheDocument()
  })

  it('displays PMO Dashboard branding', () => {
    render(<App />)
    expect(screen.getByText('PMO Dashboard')).toBeInTheDocument()
  })
})