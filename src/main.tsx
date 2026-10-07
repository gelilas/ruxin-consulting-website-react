import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SiteContentProvider } from '@/lib/site-content'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </StrictMode>,
)
