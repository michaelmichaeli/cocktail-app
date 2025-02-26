import axios, { AxiosError, isAxiosError } from 'axios'
import { Cocktail, CocktailApiResponse } from '../types/cocktail'
import { FilterListResponse } from '../types/filters'

const BASE_URL = '/api'

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export const api = {
  async searchCocktails(query: string, signal?: AbortSignal): Promise<Cocktail[]> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`,
        { signal }
      )
      return Array.isArray(response.data.drinks) ? response.data.drinks : []
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        console.error('API Error:', error.response?.status, error.message)
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to search cocktails',
          apiError.response?.status
        )
      }
      throw error
    }
  },

  async getCocktailById(id: string, signal?: AbortSignal): Promise<Cocktail | null> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/lookup.php?i=${id}`,
        { signal }
      )
      return response.data.drinks?.[0] || null
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        console.error('API Error:', error.response?.status, error.message)
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch cocktail',
          apiError.response?.status
        )
      }
      throw error
    }
  },

  async getRandomCocktail(signal?: AbortSignal): Promise<Cocktail | null> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/random.php`,
        { signal }
      )
      return response.data.drinks?.[0] || null
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        console.error('API Error:', error.response?.status, error.message)
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch random cocktail',
          apiError.response?.status
        )
      }
      throw error
    }
  },

  async getAllCocktails(signal?: AbortSignal): Promise<Cocktail[]> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/search.php?f=a`,
        { signal }
      )
      console.log('API Response:', response.data)
      return Array.isArray(response.data.drinks) ? response.data.drinks : []
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        console.error('API Error:', error.response?.status, error.message)
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch cocktails',
          apiError.response?.status
        )
      }
      throw error
    }
  },

  async getCategories(signal?: AbortSignal): Promise<string[]> {
    try {
      const response = await axios.get<FilterListResponse>(
        `${BASE_URL}/list.php?c=list`,
        { signal }
      )
      return response.data.drinks.map(drink => drink.strCategory).sort()
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch categories',
          apiError.response?.status
        )
      }
      throw error
    }
  },

  async getGlasses(signal?: AbortSignal): Promise<string[]> {
    try {
      const response = await axios.get<FilterListResponse>(
        `${BASE_URL}/list.php?g=list`,
        { signal }
      )
      return response.data.drinks.map(drink => drink.strGlass).sort()
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch glasses',
          apiError.response?.status
        )
      }
      throw error
    }
  },

  async getIngredients(signal?: AbortSignal): Promise<string[]> {
    try {
      const response = await axios.get<FilterListResponse>(
        `${BASE_URL}/list.php?i=list`,
        { signal }
      )
      return response.data.drinks.map(drink => drink.strIngredient1).sort()
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch ingredients',
          apiError.response?.status
        )
      }
      throw error
    }
  },

  async getAlcoholicTypes(signal?: AbortSignal): Promise<string[]> {
    try {
      const response = await axios.get<FilterListResponse>(
        `${BASE_URL}/list.php?a=list`,
        { signal }
      )
      return response.data.drinks.map(drink => drink.strAlcoholic).sort()
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch alcoholic types',
          apiError.response?.status
        )
      }
      throw error
    }
  }
}
