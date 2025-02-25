import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
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
      <div className="flex items-center justify-center h-[50vh]">
          <div className="card w-96 bg-error bg-opacity-10 text-error">
            <div className="card-body">
              <h2 className="card-title justify-center">Error</h2>
              <p className="text-center">Failed to load cocktails. Please try again later.</p>
            </div>
          </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="relative max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-base-content/50" />
          <input
            type="search"
            placeholder="Search cocktails..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <div 
              key={cocktail.id}
              onClick={() => navigate(`/recipe/${cocktail.id}`)}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer group"
            >
              {cocktail.imageUrl && (
                <figure className="relative">
                  <img
                    src={cocktail.imageUrl}
                    alt={cocktail.name}
                    className="aspect-[4/3] object-cover w-full transition-transform group-hover:scale-105"
                  />
                  <div className="tooltip tooltip-left absolute top-0 right-0 m-2" data-tip={`${cocktail.ingredients.length} ingredients`}>
                    <div className="badge badge-primary">{cocktail.ingredients.length}</div>
                  </div>
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">{cocktail.name}</h2>
                <div className="collapse collapse-arrow">
                  <input type="checkbox" /> 
                  <div className="collapse-title text-sm opacity-60">
                    View ingredients
                  </div>
                  <div className="collapse-content">
                    <ul className="space-y-1">
                      {cocktail.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm">
                          • {ingredient.name} - {ingredient.measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && cocktails.length === 0 && (
        <div className="card max-w-md mx-auto bg-base-200">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-base-content/60">No Results</h2>
            <p className="text-sm text-base-content/60">
              No cocktails found. Try a different search term.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
