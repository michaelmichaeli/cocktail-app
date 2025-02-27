import { Plus, Trash2, ChevronDown } from "lucide-react";
import { UseFormRegister, useFieldArray, FieldArrayWithId, FieldErrors } from "react-hook-form";
import { FormErrorMessage } from "../FormErrorMessage";
import { CocktailFormData } from "../../lib/schemas";

interface IngredientsFieldProps {
  register: UseFormRegister<CocktailFormData>;
  fieldArray: ReturnType<typeof useFieldArray<CocktailFormData, "ingredients", "id">>;
  availableIngredients: string[];
  errors?: FieldErrors<CocktailFormData>["ingredients"];
}

export function IngredientsField({
  register,
  fieldArray,
  availableIngredients,
  errors,
}: IngredientsFieldProps) {
  const { fields, append, remove } = fieldArray;

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text flex items-center gap-2">
          Ingredients
        </span>
      </label>
      {errors?.message && <FormErrorMessage message={errors.message} />}
      <div>
        {fields.map((field: FieldArrayWithId<CocktailFormData, "ingredients">, index: number) => (
          <div key={field.id}>
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1">
                <select
                  className={`select select-bordered w-full appearance-none ${
                    errors?.[index]?.name ? "select-error" : ""
                  }`}
                  {...register(`ingredients.${index}.name`)}
                >
                  <option value="">Select ingredient</option>
                  {availableIngredients.map((ing) => (
                    <option key={ing} value={ing}>
                      {ing}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
              </div>
              <input
                type="text"
                placeholder="Amount"
                className={`input input-bordered flex-1 sm:w-28 ${
                  errors?.[index]?.amount ? "input-error" : ""
                }`}
                {...register(`ingredients.${index}.amount`)}
              />
              <input
                type="text"
                placeholder="Unit"
                className={`input input-bordered flex-1 sm:w-28 ${
                  errors?.[index]?.unitOfMeasure ? "input-error" : ""
                }`}
                {...register(`ingredients.${index}.unitOfMeasure`)}
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-square hover:bg-base-200 transition-colors duration-200"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            {index < fields.length - 1 && (
              <div className="my-3 border-b border-base-300" />
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-ghost mt-2 gap-2 hover:bg-base-200 transition-all duration-200 group"
        onClick={() => append({ name: "", amount: "", unitOfMeasure: "" })}
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-180" />
        Add Ingredient
      </button>
    </div>
  );
}
