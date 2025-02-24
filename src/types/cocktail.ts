export interface Cocktail {
  idDrink: string
  strDrink: string
  strInstructions: string
  strDrinkThumb: string
  strIngredient1?: string
  strIngredient2?: string
  strIngredient3?: string
  strIngredient4?: string
  strIngredient5?: string
  strMeasure1?: string
  strMeasure2?: string
  strMeasure3?: string
  strMeasure4?: string
  strMeasure5?: string
}

export interface CocktailList {
  drinks: Cocktail[]
}

export interface CustomCocktail {
  id: string
  name: string
  instructions: string
  imageUrl?: string
  ingredients: Array<{
    name: string
    measure: string
  }>
}

export interface CocktailApiResponse {
  drinks: Cocktail[] | null
}
