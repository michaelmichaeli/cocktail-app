import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { storage } from '../lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

export function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: apiCocktail, isLoading: isLoadingApi } = useQuery({
    queryKey: ['cocktail', id],
    queryFn: () => api.getCocktailById(id || ''),
    enabled: !!id
  })

  const { data: customCocktails = [] } = useQuery({
    queryKey: ['customCocktails'],
    queryFn: storage.getCustomCocktails
  })

  const customCocktail = customCocktails.find(c => c.id === id)
  const isLoading = isLoadingApi && !customCocktail

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!apiCocktail && !customCocktail) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-destructive mb-4">Cocktail not found.</p>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const cocktail = customCocktail || {
    id: apiCocktail?.idDrink || '',
    name: apiCocktail?.strDrink || '',
    instructions: apiCocktail?.strInstructions || '',
    imageUrl: apiCocktail?.strDrinkThumb,
    ingredients: Array.from({ length: 5 }, (_, i) => {
      const ingredient = apiCocktail?.[`strIngredient${i + 1}` as keyof typeof apiCocktail]
      const measure = apiCocktail?.[`strMeasure${i + 1}` as keyof typeof apiCocktail]
      return ingredient ? { name: ingredient as string, measure: measure as string || '' } : null
    }).filter(Boolean)
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card>
        <div className="md:flex">
          {cocktail.imageUrl && (
            <div className="md:w-96 relative">
              <img
                src={cocktail.imageUrl}
                alt={cocktail.name}
                className="h-72 w-full md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
            </div>
          )}
          <div className="flex-1">
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-2xl">{cocktail.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="font-semibold mb-2">Ingredients</h2>
                <ul className="space-y-1 text-muted-foreground">
                  {cocktail.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient?.measure ? `${ingredient.measure} ${ingredient.name}` : ingredient?.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Instructions</h2>
                <p className="text-muted-foreground whitespace-pre-line">{cocktail.instructions}</p>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}
