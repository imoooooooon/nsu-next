import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminProvider from './app/AdminProvider'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/admin"><AdminProvider><App /></AdminProvider></BrowserRouter>
  </StrictMode>,
)
