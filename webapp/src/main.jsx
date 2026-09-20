import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './theme/ThemeContext'
import { AppStateProvider } from './context/AppStateContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/webapp">
      <ThemeProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
