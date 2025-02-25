import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useCocktails } from '../hooks/useCocktails'
import { CocktailCardSkeletonGrid } from '../components/CocktailCardSkeleton'
import { CustomCocktail } from '../types/cocktail'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const navigate = useNavigate()
  
  const { cocktails, isLoading, error } = useCocktails(debouncedQuery)
  const [displayedCocktails, setDisplayedCocktails] = useState<CustomCocktail[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const prevCocktailsRef = useRef<string>('')
  
  const lastCocktailElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && displayedCocktails.length < cocktails.length) {
        setIsLoadingMore(true)
        setTimeout(() => {
          const nextItems = cocktails.slice(
            displayedCocktails.length,
            displayedCocktails.length + 5
          )
          if (nextItems.length > 0) {
            setDisplayedCocktails(prev => [...prev, ...nextItems])
          }
          setIsLoadingMore(false)
        }, 500)
      }
    })
    if (node) observer.current.observe(node)
  }, [cocktails, displayedCocktails.length, isLoading])

  // Reset displayed cocktails only when cocktails array actually changes
  useEffect(() => {
    const currentCocktails = JSON.stringify(cocktails)
    if (prevCocktailsRef.current !== currentCocktails) {
      setDisplayedCocktails(cocktails.slice(0, 5))
      setIsLoadingMore(false)
      prevCocktailsRef.current = currentCocktails
    }
  }, [cocktails])

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
      <div className="relative max-w-xl mx-auto z-10">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-base-content/50" />
          <input
            type="search"
            placeholder="Search cocktails..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10 shadow-sm hover:shadow-md focus:shadow-md transition-shadow duration-200"
          />
        </div>
      </div>

      <div className="relative z-0">
        {isLoading ? (
          <div className="py-6">
            <CocktailCardSkeletonGrid />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCocktails.map((cocktail, index) => (
              <div 
                key={cocktail.id}
                ref={index === displayedCocktails.length - 1 ? lastCocktailElementRef : undefined}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 hover:bg-base-200/50 backdrop-blur-sm"
                onClick={(e) => {
                  // Don't navigate if clicking on the collapse section
                  if (!(e.target as HTMLElement).closest('.collapse')) {
                    navigate(`/recipe/${cocktail.id}`)
                  }
                }}
              >
                {cocktail.imageUrl && (
                  <figure className="relative">
                    <img
                      src={cocktail.imageUrl}
                      alt={cocktail.name}
                      loading="lazy"
                      className="aspect-[4/3] object-cover w-full transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 hover-glow"
                    />
                    <div 
                      className="tooltip tooltip-left absolute top-0 right-0 m-2" 
                      data-tip={`${cocktail.ingredients.length} ingredients`}
                    >
                      <div className="badge badge-primary bg-primary/90 backdrop-blur-sm shadow-lg">
                        {cocktail.ingredients.length}
                      </div>
                    </div>
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title">{cocktail.name}</h2>
                  <div 
                    className="collapse collapse-arrow hover:bg-base-100/50 transition-colors duration-200 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" /> 
                    <div className="collapse-title text-sm opacity-60 hover:opacity-100 transition-opacity duration-200">
                      View ingredients
                    </div>
                    <div className="collapse-content">
                      <ul className="space-y-1">
                        {cocktail.ingredients.map((ingredient, index: number) => (
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
        
        {isLoadingMore && displayedCocktails.length < cocktails.length && (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
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
    </div>
  )
}
