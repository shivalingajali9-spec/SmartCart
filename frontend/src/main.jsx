import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CompareProvider } from './context/CompareContext.jsx'
import { LenisProvider } from './context/LenisProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LenisProvider>
      <CompareProvider>
        <App />
      </CompareProvider>
    </LenisProvider>
  </StrictMode>,
)
