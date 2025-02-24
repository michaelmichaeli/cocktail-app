import { CustomCocktail } from '../types/cocktail'

const STORAGE_KEY = 'custom_cocktails'

export const storage = {
  getCustomCocktails(): CustomCocktail[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveCustomCocktail(cocktail: Omit<CustomCocktail, 'id'>): CustomCocktail {
    try {
      const cocktails = this.getCustomCocktails()
      const newCocktail: CustomCocktail = {
        ...cocktail,
        id: crypto.randomUUID()
      }
      cocktails.push(newCocktail)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cocktails))
      return newCocktail
    } catch (error) {
      throw new Error('Failed to save cocktail')
    }
  },

  deleteCustomCocktail(id: string): void {
    try {
      const cocktails = this.getCustomCocktails()
      const filtered = cocktails.filter(c => c.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      throw new Error('Failed to delete cocktail')
    }
  },

  searchCustomCocktails(query: string): CustomCocktail[] {
    const cocktails = this.getCustomCocktails()
    const lowerQuery = query.toLowerCase()
    return cocktails.filter(
      c => 
        c.name.toLowerCase().includes(lowerQuery) || 
        c.ingredients.some(i => i.name.toLowerCase().includes(lowerQuery))
    )
  }
}
