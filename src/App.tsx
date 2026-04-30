import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getLocalUser } from './lib/localData'
import { useAuthStore } from './store/authStore'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { JournalPage } from './pages/JournalPage'
import { JourneyPage } from './pages/JourneyPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function AppRoutes() {
  const { user, loading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    const saved = getLocalUser()
    setUser(saved)
    setLoading(false)
  }, [setUser, setLoading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">📓</div>
          <p className="font-heading text-mindful-dark/50">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/journal/:id" element={<JournalPage />} />
      <Route path="/journey" element={<JourneyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
