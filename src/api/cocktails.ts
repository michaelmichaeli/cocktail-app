import axios, { isAxiosError } from 'axios'
import { Cocktail, CocktailApiResponse } from '../types/features/cocktails'
import { FilterListResponse } from '../types/features/filters'

const BASE_URL = '/api'

function createApiError(message: string): Error {
  const error = new Error(message);
  error.name = 'ApiError';
  return error;
}

async function makeApiRequest<T, R>(
  endpoint: string,
  errorMessage: string,
  signal?: AbortSignal,
  transform?: (data: T) => R
): Promise<R> {
  try {
    const response = await axios.get<T>(`${BASE_URL}/${endpoint}`, { signal })
    return transform ? transform(response.data) : response.data as unknown as R
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.code === 'ERR_CANCELED') {
        throw new Error('Request was cancelled')
      }
      console.error('API Error:', error.response?.status, error.message)
      throw createApiError(errorMessage)
    }
    throw error
  }
}

export const cocktailsApi = {
  async searchCocktails(query: string, signal?: AbortSignal): Promise<Cocktail[]> {
    return makeApiRequest<CocktailApiResponse, Cocktail[]>(
      `search.php?s=${encodeURIComponent(query)}`,
      'Failed to search cocktails',
      signal,
      data => Array.isArray(data.drinks) ? data.drinks : []
    )
  },

  async getCocktailById(id: string, signal?: AbortSignal): Promise<Cocktail | null> {
    return makeApiRequest<CocktailApiResponse, Cocktail | null>(
      `lookup.php?i=${id}`,
      'Failed to fetch cocktail',
      signal,
      data => data.drinks?.[0] || null
    )
  },

  async getRandomCocktail(signal?: AbortSignal): Promise<Cocktail | null> {
    return makeApiRequest<CocktailApiResponse, Cocktail | null>(
      'random.php',
      'Failed to fetch random cocktail',
      signal,
      data => data.drinks?.[0] || null
    )
  },

  async getCategories(signal?: AbortSignal): Promise<string[]> {
    return makeApiRequest<FilterListResponse, string[]>(
      'list.php?c=list',
      'Failed to fetch categories',
      signal,
      data => data.drinks.map(drink => drink.strCategory).sort()
    )
  },

  async getGlasses(signal?: AbortSignal): Promise<string[]> {
    return makeApiRequest<FilterListResponse, string[]>(
      'list.php?g=list',
      'Failed to fetch glasses',
      signal,
      data => data.drinks.map(drink => drink.strGlass).sort()
    )
  },

  async getIngredients(signal?: AbortSignal): Promise<string[]> {
    return makeApiRequest<FilterListResponse, string[]>(
      'list.php?i=list',
      'Failed to fetch ingredients',
      signal,
      data => data.drinks.map(drink => drink.strIngredient1).sort()
    )
  },

  async getAlcoholicTypes(signal?: AbortSignal): Promise<string[]> {
    return makeApiRequest<FilterListResponse, string[]>(
      'list.php?a=list',
      'Failed to fetch alcoholic types',
      signal,
      data => data.drinks.map(drink => drink.strAlcoholic).sort()
    )
  },

  async getNonAlcoholicCocktails(signal?: AbortSignal): Promise<Cocktail[]> {
    return makeApiRequest<CocktailApiResponse, Cocktail[]>(
      'filter.php?a=Non_Alcoholic',
      'Failed to fetch non-alcoholic cocktails',
      signal,
      data => Array.isArray(data.drinks) ? data.drinks : []
    )
  },

  async getCocktailsByIngredient(ingredient: string, signal?: AbortSignal): Promise<Cocktail[]> {
    return makeApiRequest<CocktailApiResponse, Cocktail[]>(
      `filter.php?i=${encodeURIComponent(ingredient)}`,
      'Failed to fetch cocktails by ingredient',
      signal,
      data => Array.isArray(data.drinks) ? data.drinks : []
    )
  },

  async getCocktailsByCategory(category: string, signal?: AbortSignal): Promise<Cocktail[]> {
    return makeApiRequest<CocktailApiResponse, Cocktail[]>(
      `filter.php?c=${encodeURIComponent(category)}`,
      'Failed to fetch cocktails by category',
      signal,
      data => Array.isArray(data.drinks) ? data.drinks : []
    )
  },

  async getCocktailsByGlass(glass: string, signal?: AbortSignal): Promise<Cocktail[]> {
    return makeApiRequest<CocktailApiResponse, Cocktail[]>(
      `filter.php?g=${encodeURIComponent(glass)}`,
      'Failed to fetch cocktails by glass',
      signal,
      data => Array.isArray(data.drinks) ? data.drinks : []
    )
  }
}