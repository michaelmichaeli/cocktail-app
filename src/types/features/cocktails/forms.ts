import { z } from "zod";
import { AlcoholicType } from "./models";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.string().optional(),
  unitOfMeasure: z.string().optional()
});

export const cocktailFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instructions: z.string().min(1, "Instructions are required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  tags: z.array(z.string()),
  category: z.string().optional(),
  glass: z.string().optional(),
  alcoholicType: z.string()
    .transform(val => val === "" ? undefined : val)
    .pipe(z.nativeEnum(AlcoholicType).optional()),
  imageFile: z.instanceof(File).nullable()
});

export type CocktailFormData = z.infer<typeof cocktailFormSchema>;
export type IngredientFormData = z.infer<typeof ingredientSchema>; 