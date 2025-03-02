import { CustomCocktail } from '../types/features/cocktails';
import { FilterOptions } from '../components/FilterBar';
import { generateId } from './utils';

const STORAGE_KEYS = {
  CUSTOM_COCKTAILS: 'custom_cocktails',
  FILTERS: 'cocktail-filters'
} as const;

const get = async <T>(key: string): Promise<T | null> => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const set = async (key: string, value: unknown): Promise<void> => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new Error(`Failed to save to storage: ${error}`);
  }
};

const remove = async (key: string): Promise<void> => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    throw new Error(`Failed to remove from storage: ${error}`);
  }
};

const convertImageToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const storage = {
  getCustomCocktails: async (): Promise<CustomCocktail[]> => {
    return await get(STORAGE_KEYS.CUSTOM_COCKTAILS) ?? [];
  },

  saveCustomCocktails: async (cocktails: CustomCocktail[]): Promise<void> => {
    await set(STORAGE_KEYS.CUSTOM_COCKTAILS, cocktails);
  },

  addCustomCocktail: async (cocktail: Omit<CustomCocktail, "id">): Promise<CustomCocktail> => {
    let imageUrl: string | undefined;

    if (cocktail.imageFile) {
      try {
        imageUrl = await convertImageToBase64(cocktail.imageFile);
      } catch (error) {
        throw new Error(`Failed to process image: ${error}`);
      }
    }

    const newCocktail: CustomCocktail = {
      ...cocktail,
      id: generateId(),
      imageUrl
    };

    const cocktails = await storage.getCustomCocktails();
    await storage.saveCustomCocktails([...cocktails, newCocktail]);

    return newCocktail;
  },

  deleteCustomCocktail: async (id: string): Promise<void> => {
    const cocktails = await storage.getCustomCocktails();
    await storage.saveCustomCocktails(cocktails.filter(c => c.id !== id));
  },

  getFilters: async (): Promise<FilterOptions | null> => {
    return await get(STORAGE_KEYS.FILTERS);
  },

  saveFilters: async (filters: FilterOptions): Promise<void> => {
    await set(STORAGE_KEYS.FILTERS, filters);
  },

  clearFilters: async (): Promise<void> => {
    await remove(STORAGE_KEYS.FILTERS);
  }
};
