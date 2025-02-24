import axios from 'axios'
import { Cocktail, CocktailApiResponse } from '../types/cocktail'

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'

export const api = {
  async searchCocktails(query: string): Promise<Cocktail[]> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
      )
      return Array.isArray(response.data.drinks) ? response.data.drinks : []
    } catch (error) {
      console.error('Error searching cocktails:', error)
      throw new Error('Failed to search cocktails')
    }
  },

  async getCocktailById(id: string): Promise<Cocktail | null> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/lookup.php?i=${id}`
      )
      return response.data.drinks?.[0] || null
    } catch (error) {
      console.error('Error fetching cocktail:', error)
      throw new Error('Failed to fetch cocktail')
    }
  },

  async getRandomCocktail(): Promise<Cocktail | null> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/random.php`
      )
      return response.data.drinks?.[0] || null
    } catch (error) {
      console.error('Error fetching random cocktail:', error)
      throw new Error('Failed to fetch random cocktail')
    }
  },

  async getAllCocktails(): Promise<Cocktail[]> {
    try {
      const response = await axios.get<CocktailApiResponse>(
        `${BASE_URL}/search.php?s=`
      )
      return Array.isArray(response.data.drinks) ? response.data.drinks : []
    } catch (error) {
      console.error('Error fetching all cocktails:', error)
      throw new Error('Failed to fetch cocktails')
    }
  }
}
