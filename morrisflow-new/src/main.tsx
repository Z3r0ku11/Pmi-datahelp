import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Environment logging
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  console.log('🚀 MorrisFlow Framework v3.1')
  console.log('Environment:', import.meta.env.VITE_APP_ENV)
  console.log('Framework Version:', import.meta.env.VITE_FRAMEWORK_VERSION)
  console.log('Build Time:', __BUILD_TIME__)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)