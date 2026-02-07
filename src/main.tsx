import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

import ErrorBoundary from './components/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

async function prepareApp() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
      })
    } catch (error) {
      console.error('MSW failed to start:', error)
    }
  }
}

import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/ToastContainer'

prepareApp().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <ToastContainer />
          </QueryClientProvider>
        </ToastProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
})
