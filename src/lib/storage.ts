import { CustomCocktail } from '../types/cocktail'
import { generateId } from './utils'

const STORAGE_KEY = 'custom_cocktails'

const getCustomCocktails = (): CustomCocktail[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveCustomCocktails = (cocktails: CustomCocktail[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cocktails))
}

const convertImageToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

const addCustomCocktail = async (cocktail: Omit<CustomCocktail, 'id'>): Promise<CustomCocktail> => {
  let imageUrl: string | undefined = undefined

  if (cocktail.imageFile) {
    try {
      imageUrl = await convertImageToBase64(cocktail.imageFile)
    } catch (error) {
      console.error('Failed to convert image:', error)
      throw new Error('Failed to process image')
    }
  }

  const newCocktail: CustomCocktail = {
    ...cocktail,
    id: generateId(),
    imageUrl
  }

  const cocktails = getCustomCocktails()
  cocktails.push(newCocktail)
  saveCustomCocktails(cocktails)

  return newCocktail
}

const deleteCustomCocktail = (id: string): void => {
  const cocktails = getCustomCocktails()
  const updatedCocktails = cocktails.filter(c => c.id !== id)
  saveCustomCocktails(updatedCocktails)
}

export const storage = {
  getCustomCocktails,
  addCustomCocktail,
  deleteCustomCocktail,
}
