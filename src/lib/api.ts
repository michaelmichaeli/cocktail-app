import axios, { AxiosError, isAxiosError } from 'axios'
import { Cocktail, CocktailApiResponse } from '../types/cocktail'

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'

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
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
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
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
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
        `${BASE_URL}/search.php?s=`,
        { signal }
      )
      return Array.isArray(response.data.drinks) ? response.data.drinks : []
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          throw new Error('Request was cancelled')
        }
        const apiError = error as AxiosError
        throw new ApiError(
          'Failed to fetch cocktails',
          apiError.response?.status
        )
      }
      throw error
    }
  }
}
