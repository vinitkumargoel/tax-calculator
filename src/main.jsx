import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)