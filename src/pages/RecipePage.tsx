import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { storage } from '../lib/storage'

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
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    )
  }

  if (!apiCocktail && !customCocktail) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Cocktail not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
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
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="md:flex">
        {cocktail.imageUrl && (
          <div className="md:flex-shrink-0">
            <img
              src={cocktail.imageUrl}
              alt={cocktail.name}
              className="h-72 w-full object-cover md:w-96"
            />
          </div>
        )}
        <div className="p-8">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{cocktail.name}</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              Back
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Ingredients</h2>
            <ul className="mt-2 space-y-2">
              {cocktail.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-600">
                  {ingredient?.measure ? `${ingredient.measure} ${ingredient.name}` : ingredient?.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Instructions</h2>
            <p className="mt-2 text-gray-600">{cocktail.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
