import { Type, FileText, List, Wine, Beer, TagsIcon, Save, Image as ImageIcon } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAddCocktail } from "../hooks/useAddCocktail";
import { useFiltersStore } from "../store/filters";
import { showToast } from "../lib/toast";
import { CustomCocktail } from "../types/features/cocktails";
import { CocktailFormData, cocktailFormSchema } from "../lib/schemas";
import { ImageUpload } from "../components/form/ImageUpload";
import { DeleteDialog } from "../components/DeleteDialog";
import { TagInput } from "../components/form/TagInput";
import { TextField } from "../components/form/TextField";
import { SelectField } from "../components/form/SelectField";
import { AlcoholicTypeSelect } from "../components/form/AlcoholicTypeSelect";
import { IngredientsField } from "../components/form/IngredientsField";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { FormErrorMessage } from "../components/form/FormErrorMessage";
import { useFormNavigation } from "../hooks/useFormNavigation";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function AddCocktailPage() {
  const navigate = useNavigate();
  const { addCustomCocktail, isAddingCocktail } = useAddCocktail();
  const { categories, glasses, ingredients: availableIngredients, isLoading: isLoadingFilters, error: filtersError } = useFiltersStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setValue,
    setError: setFormError,
    getValues,
  } = useForm<CocktailFormData>({
    resolver: zodResolver(cocktailFormSchema),
    defaultValues: {
      ingredients: [{ name: "", amount: "", unitOfMeasure: "" }],
      tags: [],
      imageFile: null
    }
  });

  const fieldArray = useFieldArray({
    control,
    name: "ingredients"
  });

  const { showDialog, handleClose, handleConfirm } = useFormNavigation({
    isDirty,
    onLeave: () => {
      const imageFile = getValues("imageFile");
      if (imageFile) {
        URL.revokeObjectURL(URL.createObjectURL(imageFile));
      }
    }
  });

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
      category: data.category,
      glass: data.glass,
      alcoholicType: data.alcoholicType,
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

  if (isLoadingFilters) {
    return <LoadingState text="Loading form options..." />;
  }

  if (filtersError) {
    return <ErrorState title="Failed to load form options" message={filtersError} />;
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl mx-auto px-3 sm:px-6 pt-4 pb-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body px-3 sm:px-6">
            <h2 className="card-title text-2xl mb-6">Add New Cocktail</h2>

            <div>
              {errors.root && <FormErrorMessage message={errors.root.message || ""} />}
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

                <TextField
                  id="name"
                  label="Name"
                  icon={<Type className="h-4 w-4" />}
                  error={errors.name?.message}
                  register={register}
                  name="name"
                />

                <IngredientsField
                  register={register}
                  fieldArray={fieldArray}
                  availableIngredients={availableIngredients}
                  errors={errors.ingredients}
                />

                <TextField
                  id="instructions"
                  label="Instructions"
                  icon={<FileText className="h-4 w-4" />}
                  error={errors.instructions?.message}
                  register={register}
                  name="instructions"
                  type="textarea"
                />

                <SelectField
                  id="category"
                  label="Category"
                  icon={<List className="h-4 w-4" />}
                  options={categories}
                  placeholder="Select a category"
                  error={errors.category?.message}
                  register={register}
                  name="category"
                />

                <SelectField
                  id="glass"
                  label="Glass Type"
                  icon={<Wine className="h-4 w-4" />}
                  options={glasses}
                  placeholder="Select a glass type"
                  error={errors.glass?.message}
                  register={register}
                  name="glass"
                />

                <AlcoholicTypeSelect
                  id="alcoholicType"
                  label="Alcohol Content"
                  icon={<Beer className="h-4 w-4" />}
                  placeholder="Select alcohol content"
                  error={errors.alcoholicType?.message}
                  register={register}
                  name="alcoholicType"
                />

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
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
      />
    </div>
  );
}
