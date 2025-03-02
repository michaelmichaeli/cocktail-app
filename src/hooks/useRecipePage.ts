import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cocktailsApi } from "../api/cocktails";
import { storage } from "../lib/storage";
import { showToast } from "../lib/toast";
import { Ingredient, AlcoholicType } from "../types/features/cocktails";

export function useRecipePage(id: string | undefined) {
  const queryClient = useQueryClient();

  const { data: apiCocktail, isLoading: isLoadingApi } = useQuery({
    queryKey: ['cocktail', id],
    queryFn: () => cocktailsApi.getCocktailById(id || ''),
    enabled: !!id
  });

  const { data: customCocktails = [] } = useQuery({
    queryKey: ['customCocktails'],
    queryFn: storage.getCustomCocktails
  });

  const { mutateAsync: deleteCustomCocktail, isPending: isDeletingCocktail } = useMutation({
    mutationFn: storage.deleteCustomCocktail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customCocktails"] });
      showToast("Cocktail deleted successfully", "success");
    },
    onError: (error) => {
      showToast("Failed to delete cocktail: " + error, "error");
    }
  });

  const customCocktail = customCocktails.find(c => c.id === id);
  const isLoading = isLoadingApi && !customCocktail;

  const cocktail = customCocktail || (apiCocktail ? {
    id: apiCocktail.idDrink,
    name: apiCocktail.strDrink,
    instructions: apiCocktail.strInstructions,
    imageUrl: apiCocktail.strDrinkThumb,
    ingredients: Array.from({ length: 15 }, (_, i) => {
      const ingredient = apiCocktail[`strIngredient${i + 1}` as keyof typeof apiCocktail]
      const measure = apiCocktail[`strMeasure${i + 1}` as keyof typeof apiCocktail] as string || ''
      const [amount, unitOfMeasure] = (measure || '').split(' ').filter(Boolean)
      return ingredient ? {
        name: ingredient as string,
        amount: amount || '',
        unitOfMeasure: unitOfMeasure || ''
      } : undefined
    }).filter((ing): ing is Ingredient => ing !== undefined),
    tags: apiCocktail.strTags?.split(',').map(tag => tag.trim()) || [],
    category: apiCocktail.strCategory,
    glass: apiCocktail.strGlass,
    alcoholicType: apiCocktail.strAlcoholic 
      ? Object.values(AlcoholicType).find(t => t === apiCocktail.strAlcoholic) || AlcoholicType.OPTIONAL 
      : AlcoholicType.OPTIONAL,
    dateModified: apiCocktail.dateModified || new Date().toISOString()
  } : null);

  return {
    cocktail,
    isLoading,
    isCustom: !!customCocktail,
    deleteCustomCocktail,
    isDeletingCocktail
  };
}
