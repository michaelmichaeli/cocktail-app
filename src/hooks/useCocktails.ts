import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { storage } from '../lib/storage'
import { showToast } from '../lib/toast'
import { Cocktail, CustomCocktail } from '../types/cocktail'

export function useCocktails(searchQuery: string = '') {
  const queryClient = useQueryClient()

  const { data: apiCocktails = [], isLoading: isLoadingApi, error: apiError } = useQuery({
    queryKey: ['cocktails', searchQuery],
    queryFn: () => api.searchCocktails(searchQuery),
    enabled: !searchQuery.includes('my-') // Only fetch from API if not searching custom cocktails
  })

  const { data: customCocktails = [], isLoading: isLoadingCustom } = useQuery({
    queryKey: ['customCocktails'],
    queryFn: storage.getCustomCocktails,
    staleTime: 0 // Always fetch fresh data
  })

  const addCustomCocktailMutation = useMutation({
    mutationFn: (cocktail: Omit<CustomCocktail, 'id'>) => storage.addCustomCocktail(cocktail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customCocktails'] })
    },
    onError: (error) => {
      showToast('Failed to save cocktail: ' + error, 'error')
    }
  })

  // Filter custom cocktails if search query starts with 'my-'
  const filteredCustomCocktails = searchQuery.startsWith('my-')
    ? customCocktails.filter(c => 
        c.name.toLowerCase().includes(searchQuery.replace('my-', '').toLowerCase())
      )
    : customCocktails

  // Combine and format results
  const cocktails = searchQuery.startsWith('my-')
    ? filteredCustomCocktails
    : [
        ...customCocktails,
        ...apiCocktails.map((c: Cocktail) => ({
          id: c.idDrink,
          name: c.strDrink,
          instructions: c.strInstructions,
          imageUrl: c.strDrinkThumb,
          ingredients: Array.from({ length: 5 }, (_, i) => {
            const ingredient = c[`strIngredient${i + 1}` as keyof typeof c]
            const measure = c[`strMeasure${i + 1}` as keyof typeof c]
            return ingredient ? { name: ingredient as string, measure: measure as string || '' } : null
          }).filter(Boolean) as { name: string; measure: string }[]
        }))
      ]

  return {
    cocktails,
    isLoading: isLoadingApi || isLoadingCustom,
    error: apiError,
    addCustomCocktail: addCustomCocktailMutation.mutateAsync,
    isAddingCocktail: addCustomCocktailMutation.isPending
  }
}
