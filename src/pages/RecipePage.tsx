import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { Maximize2, Trash2 } from "lucide-react";
import DEFAULT_COCKTAIL_IMAGE from "../../public/default-cocktail.png";
import { api } from "../lib/api";
import { storage } from "../lib/storage";
import { useCocktails } from "../hooks/useCocktails";
import { showToast } from "../lib/toast";
import { DeleteDialog } from "../components/DeleteDialog";

export function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate();
  const { deleteCustomCocktail } = useCocktails();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        <div className="card overflow-hidden w-96 bg-error bg-opacity-10 text-error">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">Not Found</h2>
            <p>Cocktail not found.</p>
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
      const measure = apiCocktail?.[`strMeasure${i + 1}` as keyof typeof apiCocktail] as string || ''
      const [amount, unitOfMeasure] = (measure || '').split(' ').filter(Boolean)
      return ingredient ? {
        name: ingredient as string,
        amount: amount || '',
        unitOfMeasure: unitOfMeasure || ''
      } : null
    }).filter(Boolean),
    tags: apiCocktail?.strTags?.split(',').map(tag => tag.trim()) || [],
    category: apiCocktail?.strCategory || 'Unknown',
    glass: apiCocktail?.strGlass || 'Unknown',
    isAlcoholic: apiCocktail?.strAlcoholic?.toLowerCase().includes('alcoholic') ?? false,
    dateModified: apiCocktail?.dateModified || new Date().toISOString()
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-4">
      <div className="card overflow-hidden bg-base-100 shadow-xl">
        <div className="md:flex">
          {(
            <div className="md:w-96 relative group">
              <figure className="relative">
                <img
                  src={cocktail.imageUrl || DEFAULT_COCKTAIL_IMAGE}
                  alt={cocktail.name}
                  className="h-72 w-full md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                />
                <button
                  onClick={() => {
                    const modal = document.getElementById('imageModal') as HTMLDialogElement;
                    modal?.showModal();
                  }}
                  className="btn btn-circle btn-ghost absolute top-2 right-2 bg-base-100/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-base-100 hover:scale-110"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </figure>

              <dialog id="imageModal" className="modal">
                <div className="modal-box max-w-3xl bg-base-100">
                  <img
                  src={cocktail.imageUrl || DEFAULT_COCKTAIL_IMAGE}
                    alt={cocktail.name}
                    className="w-full rounded-lg"
                  />
                </div>
                <form method="dialog" className="modal-backdrop bg-base-100/80">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          )}
          <div className="flex-1">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title text-2xl mb-2">{cocktail.name}</h2>
                {customCocktail && (
                  <button
                    className="btn btn-error btn-sm gap-2"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
              <div className="divider"></div>
              <div className="overflow-y-auto max-h-[calc(100vh-20rem)] pr-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1 text-base-content/70">
                      {cocktail.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {`${ingredient?.name}${ingredient?.amount ? ` - ${ingredient.amount} ${ingredient.unitOfMeasure}` : ''}`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Instructions</h3>
                    <p className="text-base-content/70 whitespace-pre-line">{cocktail.instructions}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${cocktail.isAlcoholic ? 'badge-secondary' : 'badge-primary'}`}>
                          {cocktail.isAlcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
                        </span>
                      </div>
                      <p className="text-base-content/70">
                        <span className="font-medium">Category:</span> {cocktail.category}
                      </p>
                      <p className="text-base-content/70">
                        <span className="font-medium">Glass Type:</span> {cocktail.glass}
                      </p>
                      {cocktail.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {cocktail.tags.map((tag, index) => (
                            <span key={index} className="badge badge-outline">{tag}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-base-content/50">
                        Last modified: {new Date(cocktail.dateModified).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          await deleteCustomCocktail(cocktail.id);
          showToast("Cocktail deleted successfully", "success");
          navigate("/");
        }}
        title="Delete Cocktail"
        message="Are you sure you want to delete this cocktail? This action cannot be undone."
      />
    </div>
  );
}
