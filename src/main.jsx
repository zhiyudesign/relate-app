import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppStateProvider } from './state.jsx'
import '@fontsource/bitter/600.css'
import '@fontsource/bitter/800.css'
import '@fontsource/carlito/400.css'
import '@fontsource/carlito/700.css'
import '@fontsource/carlito/700-italic.css'
import './index.css'

// HashRouter keeps deep links working on GitHub Pages (no server rewrites needed).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </HashRouter>
  </StrictMode>,
)
