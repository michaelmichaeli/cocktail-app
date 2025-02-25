import { createBrowserRouter, RouterProvider, useRouteError, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { HomePage } from './pages/HomePage'
import { RecipePage } from './pages/RecipePage'
import { AddCocktailPage } from './pages/AddCocktailPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/Navbar'

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )
}

function RouteErrorBoundary() {
  const error = useRouteError() as Error

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-2xl font-bold mb-4">Page Error</h2>
      <p className="text-base-content/70 mb-6">{error?.message || 'An unexpected error occurred'}</p>
      <button 
        className="btn btn-primary"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  )
}

function RootLayout() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="py-6">
        <Outlet />
      </main>
      <div id="toast-container" className="toast toast-top toast-end"></div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/recipe/:id',
        element: <RecipePage />
      },
      {
        path: '/add',
        element: <AddCocktailPage />
      }
    ]
  }
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false
    }
  }
})

export default function App() {
  return (
    <QueryErrorResetBoundary>
      {() => (
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LoadingFallback />}>
              <RouterProvider router={router} />
            </Suspense>
          </QueryClientProvider>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
