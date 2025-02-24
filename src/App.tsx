import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './pages/HomePage'
import { RecipePage } from './pages/RecipePage'
import { AddCocktailPage } from './pages/AddCocktailPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1
    }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex items-center px-2 py-2 text-gray-900">
                    Cocktail App
                  </Link>
                  <div className="ml-6 flex space-x-4">
                    <Link
                      to="/"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
                    >
                      Home
                    </Link>
                    <Link
                      to="/add"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-700"
                    >
                      Add New
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/add" element={<AddCocktailPage />} />
              <Route path="*" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900">404 - Page Not Found</h2>
                  <Link to="/" className="mt-4 text-blue-600 hover:text-blue-800">
                    Return to Home
                  </Link>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
