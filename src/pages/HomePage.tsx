import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useCocktails } from '../hooks/useCocktails'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

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
        <Card className="w-[450px] bg-destructive/10 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-destructive">Failed to load cocktails. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search cocktails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <Card
              key={cocktail.id}
              onClick={() => navigate(`/recipe/${cocktail.id}`)}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              {cocktail.imageUrl && (
                <div className="aspect-[4/3] relative overflow-hidden rounded-t-xl">
                  <img
                    src={cocktail.imageUrl}
                    alt={cocktail.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{cocktail.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {cocktail.ingredients.length} ingredients
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && cocktails.length === 0 && (
        <Card className="mx-auto max-w-md bg-muted/50">
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">No Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              No cocktails found. Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
