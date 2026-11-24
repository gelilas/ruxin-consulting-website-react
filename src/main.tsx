import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SiteContentProvider } from '@/lib/site-content'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </BrowserRouter>
  </StrictMode>,
)
