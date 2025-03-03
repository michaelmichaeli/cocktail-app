import { create } from 'zustand'
import { type StateCreator } from 'zustand'
import { cocktailsApi } from '../api/cocktails'
import { type Filters } from '../types/features/filters'

export interface State extends Filters {
  fetchFilters: () => Promise<void>;
}

const createStore: StateCreator<State> = (set) => ({
  categories: [],
  glasses: [],
  ingredients: [],
  alcoholicTypes: [],
  isLoading: false,
  error: null,

  fetchFilters: async () => {
    set({ isLoading: true, error: null })
    try {
      const [categories, glasses, ingredients, alcoholicTypes] = await Promise.all([
        cocktailsApi.getCategories(),
        cocktailsApi.getGlasses(),
        cocktailsApi.getIngredients(),
        cocktailsApi.getAlcoholicTypes()
      ])

      set({
        categories,
        glasses,
        ingredients,
        alcoholicTypes,
        isLoading: false
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch filters',
        isLoading: false
      })
    }
  }
})

export const useFiltersStore = create<State>(createStore)
