import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { Plus, Trash2, AlertCircle, Image as ImageIcon, Type, Utensils, FileText, List, Wine, Beer, Tags as TagsIcon, Save, ChevronDown } from "lucide-react";
import { useAddCocktail } from "../hooks/useAddCocktail";
import { useFiltersStore } from "../store/filters";
import { showToast } from "../lib/toast";
import { CustomCocktail } from "../types/cocktail";
import { CocktailFormData, cocktailFormSchema } from "../lib/schemas";
import { ImageUpload } from "../components/ImageUpload";
import { DeleteDialog } from "../components/DeleteDialog";
import { TagInput } from "../components/TagInput";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function AddCocktailPage() {
  const navigate = useNavigate();
  const { addCustomCocktail, isAddingCocktail } = useAddCocktail();
  const { categories, glasses, ingredients: availableIngredients, alcoholicTypes, fetchFilters, isLoading: isLoadingFilters, error: filtersError } = useFiltersStore();

  const {
    getValues,
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setValue,
    setError: setFormError,
  } = useForm<CocktailFormData>({
    resolver: zodResolver(cocktailFormSchema),
    defaultValues: {
      ingredients: [{ name: "", amount: "", unitOfMeasure: "" }],
      tags: [],
      imageFile: null
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients"
  });

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const [showDialog, setShowDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeNavigate = (event: Event) => {
      if (isDirty) {
        const e = event as PopStateEvent;
        e.preventDefault();
        setPendingPath(window.location.pathname);
        setShowDialog(true);
      }
    };

    window.addEventListener("popstate", handleBeforeNavigate);
    return () => window.removeEventListener("popstate", handleBeforeNavigate);
  }, [isDirty]);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault();
          event.returnValue = "";
        }
      },
      [isDirty]
    )
  );


  const onSubmit = async (data: CocktailFormData) => {
    const validIngredients = data.ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        name: i.name.trim(),
        amount: i.amount?.trim() || "",
        unitOfMeasure: i.unitOfMeasure?.trim() || "",
      }));

    const newCocktail: Omit<CustomCocktail, "id"> = {
      name: data.name.trim(),
      instructions: data.instructions.trim(),
      ingredients: validIngredients,
      imageFile: data.imageFile || undefined,
      imageUrl: data.imageFile ? undefined : DEFAULT_COCKTAIL_IMAGE,
      tags: data.tags,
      category: data.category || "Other/Unknown",
      glass: data.glass || "Other/Unknown",
      isAlcoholic: data.isAlcoholic === "Yes",
      dateModified: new Date().toISOString()
    };

    try {
      const savedCocktail = await addCustomCocktail(newCocktail);
      showToast("Cocktail was successfully saved!", "success");
      navigate(`/recipe/${savedCocktail.id}`);
    } catch (err) {
      console.error(err);
      setFormError("root", { message: "Failed to save cocktail" });
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <span className="mt-2 text-sm text-error flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      {message}
    </span>
  );

  if (isLoadingFilters) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (filtersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-error" />
          <h2 className="text-xl font-semibold mb-2">Failed to load form options</h2>
          <p className="text-base-content/70">{filtersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl mx-auto px-3 sm:px-6 pt-4 pb-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body px-3 sm:px-6">
            <h2 className="card-title text-2xl mb-6">Add New Cocktail</h2>

            <div>
              {errors.root && <ErrorMessage message={errors.root.message || ""} />}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </span>
                  </label>
                  <ImageUpload
                    onImageSelect={(file) => setValue("imageFile", file)}
                    onImageClear={() => setValue("imageFile", null)}
                  />
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="name">
                    <span className="label-text flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Name
                    </span>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="name"
                      className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                      {...register("name")}
                    />
                    {errors.name && <ErrorMessage message={errors.name.message || ""} />}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Ingredients
                    </span>
                  </label>
                  {errors.ingredients && <ErrorMessage message={errors.ingredients.message || ""} />}
                  <div>
                    {fields.map((field, index) => (
                      <div key={index}>
                        <div className="flex flex-wrap gap-3">
                          <div className="relative flex-1">
                            <select
                              className={`select select-bordered w-full appearance-none ${errors.ingredients?.[index]?.name ? "select-error" : ""}`}
                              {...register(`ingredients.${index}.name`)}
                            >
                              <option value="">Select ingredient</option>
                              {availableIngredients.map((ing) => (
                                <option key={ing} value={ing}>{ing}</option>
                              ))}
                            </select>
                            <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
                          </div>
                          <input
                            type="text"
                            placeholder="Amount"
                            className={`input input-bordered flex-1 sm:w-28 ${errors.ingredients?.[index]?.amount ? "input-error" : ""}`}
                            {...register(`ingredients.${index}.amount`)}
                          />
                          <input
                            type="text"
                            placeholder="Unit"
                            className={`input input-bordered flex-1 sm:w-28 ${errors.ingredients?.[index]?.unitOfMeasure ? "input-error" : ""}`}
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

                <div className="form-control">
                  <label className="label" htmlFor="instructions">
                    <span className="label-text flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Instructions
                    </span>
                  </label>
                  <div>
                    <textarea
                      id="instructions"
                      className={`textarea textarea-bordered h-36 w-full ${errors.instructions ? "textarea-error" : ""}`}
                      {...register("instructions")}
                    />
                    {errors.instructions && <ErrorMessage message={errors.instructions.message || ""} />}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="category">
                    <span className="label-text flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Category
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      className={`select select-bordered w-full appearance-none ${errors.category ? "select-error" : ""}`}
                      {...register("category")}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
                    {errors.category && <ErrorMessage message={errors.category.message || ""} />}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="glass">
                    <span className="label-text flex items-center gap-2">
                      <Wine className="h-4 w-4" />
                      Glass Type
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="glass"
                      className={`select select-bordered w-full appearance-none ${errors.glass ? "select-error" : ""}`}
                      {...register("glass")}
                    >
                      <option value="">Select a glass type</option>
                      {glasses.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
                    {errors.glass && <ErrorMessage message={errors.glass.message || ""} />}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="alcoholic">
                    <span className="label-text flex items-center gap-2">
                      <Beer className="h-4 w-4" />
                      Contains Alcohol
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="alcoholic"
                      className="select select-bordered w-full appearance-none"
                      {...register("isAlcoholic")}
                    >
                      <option value="">Select alcohol content</option>
                      {alcoholicTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="tags">
                    <span className="label-text flex items-center gap-2">
                      <TagsIcon className="h-4 w-4" />
                      Tags
                    </span>
                  </label>
                  <TagInput
                    tags={watch("tags")}
                    onChange={(newTags) => setValue("tags", newTags)}
                    placeholder="Enter a tag and press Enter or click Add Tag"
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary w-full gap-2 ${
                    isAddingCocktail ? "loading" : ""
                  }`}
                  disabled={isAddingCocktail}
                >
                  {!isAddingCocktail && <Save className="h-4 w-4" />}
                  {isAddingCocktail ? "Saving..." : "Save Cocktail"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setPendingPath(null);
        }}
        onConfirm={() => {
          setShowDialog(false);
          const imageFile = getValues("imageFile");
          if (imageFile) {
            URL.revokeObjectURL(URL.createObjectURL(imageFile));
          }
          if (pendingPath) {
            navigate(pendingPath);
          } else {
            navigate("/");
          }
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
      />
    </div>
  );
}
