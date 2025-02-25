import { useQuery, useMutation, useQueryClient, useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from '../lib/api'
import { storage } from '../lib/storage'
import { Cocktail, CustomCocktail } from '../types/cocktail'

export function useCocktails(searchQuery = '') {
  const queryClient = useQueryClient()

  const {
    data: apiCocktails,
    isLoading: isLoadingApi,
    error: apiError
  } = useQuery({
    queryKey: ['cocktails', searchQuery],
    queryFn: async ({ signal }) => {
      return searchQuery ? api.searchCocktails(searchQuery, signal) : api.getAllCocktails(signal)
    },
    select: (data) => data || [] // ensure we always have an array
  })

  const {
    data: customCocktails = [],
    isLoading: isLoadingCustom
  } = useQuery({
    queryKey: ['customCocktails', searchQuery],
    queryFn: async () => storage.searchCustomCocktails(searchQuery),
    retry: false
  })

  const addCustomCocktailMutation = useMutation({
    mutationFn: (newCocktail: Omit<CustomCocktail, 'id'>) => 
      Promise.resolve(storage.saveCustomCocktail(newCocktail)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customCocktails'] })
    }
  })

  const deleteCustomCocktailMutation = useMutation({
    mutationFn: (id: string) => 
      Promise.resolve(storage.deleteCustomCocktail(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customCocktails'] })
    }
  })

  const isLoading = isLoadingApi || isLoadingCustom
  const error = apiError || addCustomCocktailMutation.error || deleteCustomCocktailMutation.error

  function normalizeApiCocktail(cocktail: Cocktail): CustomCocktail {
    const ingredients = []
    for (let i = 1; i <= 5; i++) {
      const ingredient = cocktail[`strIngredient${i}` as keyof Cocktail]
      const measure = cocktail[`strMeasure${i}` as keyof Cocktail]
      if (ingredient) {
        ingredients.push({
          name: ingredient,
          measure: measure || ''
        })
      }
    }

    return {
      id: cocktail.idDrink,
      name: cocktail.strDrink,
      instructions: cocktail.strInstructions,
      imageUrl: cocktail.strDrinkThumb,
      ingredients
    }
  }

  // Reset error state when searchQuery changes
  const { reset } = useQueryErrorResetBoundary()
  useEffect(() => {
    reset()
  }, [searchQuery, reset])

  const normalizedApiCocktails = (apiCocktails || []).map(normalizeApiCocktail)
  const allCocktails = [...normalizedApiCocktails, ...(customCocktails || [])]

  const isError = Boolean(error)

  return {
    cocktails: allCocktails,
    isLoading,
    error,
    addCustomCocktail: addCustomCocktailMutation.mutate,
    deleteCustomCocktail: deleteCustomCocktailMutation.mutate,
    isAddingCocktail: addCustomCocktailMutation.isPending,
    isDeletingCocktail: deleteCustomCocktailMutation.isPending,
    isError,
    reset
  }
}
