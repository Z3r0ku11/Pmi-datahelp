import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
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

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })

  it('displays PMI-DataHelp title', async () => {
    render(<App />)
    expect(screen.getByText('PMI-DataHelp')).toBeInTheDocument()
  })

  it('shows navigation menu', async () => {
    render(<App />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Módulos')).toBeInTheDocument()
    expect(screen.getByText('Herramientas')).toBeInTheDocument()
    expect(screen.getByText('Recursos')).toBeInTheDocument()
  })
})