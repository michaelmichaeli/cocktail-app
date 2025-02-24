import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCocktails } from '../hooks/useCocktails'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const navigate = useNavigate()
  
  const { cocktails, isLoading, error } = useCocktails(debouncedQuery)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load cocktails. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="search"
          placeholder="Search cocktails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <div
              key={cocktail.id}
              onClick={() => navigate(`/recipe/${cocktail.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              {cocktail.imageUrl && (
                <img
                  src={cocktail.imageUrl}
                  alt={cocktail.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {cocktail.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {cocktail.ingredients.length} ingredients
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && cocktails.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cocktails found. Try a different search term.</p>
        </div>
      )}
    </div>
  )
}
