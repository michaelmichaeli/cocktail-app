import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Maximize2, Share2 } from 'lucide-react'
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
      <div className="flex items-center justify-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (!apiCocktail && !customCocktail) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="card w-96 bg-error bg-opacity-10 text-error">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">Not Found</h2>
            <p className="mb-4">Cocktail not found.</p>
            <div className="card-actions justify-center">
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
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
        <div className="card bg-base-100 shadow-xl">
          <div className="md:flex">
            {cocktail.imageUrl && (
              <div className="md:w-96 relative group">
                <figure className="relative">
                  <img
                    src={cocktail.imageUrl}
                    alt={cocktail.name}
                    className="h-72 w-full md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                  <button
                    onClick={() => {
                      const modal = document.getElementById('imageModal') as HTMLDialogElement;
                      modal?.showModal();
                    }}
                    className="btn btn-circle btn-ghost absolute top-2 right-2 bg-base-100/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </figure>

                <dialog id="imageModal" className="modal">
                  <div className="modal-box max-w-3xl">
                    <h3 className="font-bold text-lg mb-4">{cocktail.name}</h3>
                    <img
                      src={cocktail.imageUrl}
                      alt={cocktail.name}
                      className="w-full rounded-lg"
                    />
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                </dialog>
              </div>
            )}
            <div className="flex-1">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-2xl">{cocktail.name}</h2>
                    {navigator.share && (
                      <button
                        className="btn btn-ghost btn-sm mt-2 text-base-content/60"
                        onClick={() => {
                          navigator.share({
                            title: cocktail.name,
                            text: `Check out this ${cocktail.name} recipe!`,
                            url: window.location.href,
                          })
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Recipe
                      </button>
                    )}
                  </div>
                  <button
                    className="btn btn-ghost btn-sm text-base-content/60"
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </button>
                </div>
                <div className="divider"></div>
                <div className="overflow-y-auto max-h-[calc(100vh-20rem)] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Ingredients</h3>
                      <ul className="list-disc list-inside space-y-1 text-base-content/70">
                        {cocktail.ingredients.map((ingredient, index) => (
                          <li key={index}>
                            {ingredient?.measure ? `${ingredient.measure} ${ingredient.name}` : ingredient?.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Instructions</h3>
                      <p className="text-base-content/70 whitespace-pre-line">{cocktail.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
