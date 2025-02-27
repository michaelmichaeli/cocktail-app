import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { Plus, Trash2, AlertCircle, Image as ImageIcon, Type, Utensils, FileText, List, Wine, Beer, Tags as TagsIcon, Save, ChevronDown } from "lucide-react";
import { useAddCocktail } from "../hooks/useAddCocktail";
import { useFiltersStore } from "../store/filters";
import { showToast } from "../lib/toast";
import { CustomCocktail } from "../types/cocktail";
import { ImageUpload } from "../components/ImageUpload";
import { DeleteDialog } from "../components/DeleteDialog";
import { TagInput } from "../components/TagInput";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function AddCocktailPage() {
  const navigate = useNavigate();
  const { addCustomCocktail, isAddingCocktail } = useAddCocktail();
  const { categories, glasses, ingredients: availableIngredients, alcoholicTypes, fetchFilters, isLoading: isLoadingFilters, error: filtersError } = useFiltersStore();

  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string; unitOfMeasure: string }>>([
    { name: "", amount: "", unitOfMeasure: "" }
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [glass, setGlass] = useState("");
  const [isAlcoholic, setIsAlcoholic] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"name" | "ingredients" | "instructions" | "category" | "glass" | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const hasUnsavedChanges = useCallback(() => {
    return (
      name.trim() !== "" ||
      instructions.trim() !== "" ||
      ingredients.some(
        (i) =>
          i.name.trim() !== "" ||
          i.amount.trim() !== "" ||
          i.unitOfMeasure.trim() !== ""
      ) ||
      imageFile !== null
    );
  }, [name, instructions, ingredients, imageFile]);

  useEffect(() => {
    setIsDirty(hasUnsavedChanges());
  }, [name, instructions, ingredients, imageFile, hasUnsavedChanges]);

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

  const nameInputRef = useRef<HTMLInputElement>(null);
  const ingredientInputRef = useRef<HTMLSelectElement>(null);
  const instructionsInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorField(null);

    if (!name.trim()) {
      setError("Name is required");
      setErrorField("name");
      nameInputRef.current?.focus();
      return;
    }

    if (!instructions.trim()) {
      setError("Instructions are required");
      setErrorField("instructions");
      instructionsInputRef.current?.focus();
      return;
    }

    const validIngredients = ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        name: i.name.trim(),
        amount: i.amount.trim(),
        unitOfMeasure: i.unitOfMeasure.trim(),
      }));

    if (validIngredients.length === 0) {
      setError("At least one ingredient is required");
      setErrorField("ingredients");
      ingredientInputRef.current?.focus();
      return;
    }

    const newCocktail: Omit<CustomCocktail, "id"> = {
      name: name.trim(),
      instructions: instructions.trim(),
      ingredients: validIngredients,
      imageFile: imageFile || undefined,
      imageUrl: imageFile ? undefined : DEFAULT_COCKTAIL_IMAGE,
      tags,
      category: category || "Other/Unknown",
      glass: glass || "Other/Unknown",
      isAlcoholic: isAlcoholic === "Yes",
      dateModified: new Date().toISOString()
    };

    try {
      const savedCocktail = await addCustomCocktail(newCocktail);
      showToast("Cocktail was successfully saved!", "success");
      navigate(`/recipe/${savedCocktail.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save cocktail");
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unitOfMeasure: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    field: "name" | "amount" | "unitOfMeasure",
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </span>
                  </label>
                  <ImageUpload
                    onImageSelect={(file) => setImageFile(file)}
                    onImageClear={() => setImageFile(null)}
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
                      ref={nameInputRef}
                      id="name"
                      className={`input input-bordered w-full ${errorField === "name" ? "input-error" : ""}`}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                        setErrorField(null);
                      }}
                      required
                    />
                    {errorField === "name" && <ErrorMessage message={error} />}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Ingredients
                    </span>
                  </label>
                  {errorField === "ingredients" && <ErrorMessage message={error} />}
                  <div>
                    {ingredients.map((ingredient, index) => (
                      <div key={index}>
                        <div className="flex flex-wrap gap-3">
                          <div className="relative flex-1">
                            <select
                              ref={index === 0 ? ingredientInputRef : undefined}
                              className={`select select-bordered w-full appearance-none ${errorField === "ingredients" ? "select-error" : ""}`}
                              value={ingredient.name}
                              onChange={(e) => {
                                handleIngredientChange(index, "name", e.target.value);
                                setError("");
                                setErrorField(null);
                              }}
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
                            className={`input input-bordered flex-1 sm:w-28 ${errorField === "ingredients" ? "input-error" : ""}`}
                            value={ingredient.amount}
                            onChange={(e) => {
                              handleIngredientChange(index, "amount", e.target.value);
                              setError("");
                              setErrorField(null);
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Unit"
                            className={`input input-bordered flex-1 sm:w-28 ${errorField === "ingredients" ? "input-error" : ""}`}
                            value={ingredient.unitOfMeasure}
                            onChange={(e) => {
                              handleIngredientChange(index, "unitOfMeasure", e.target.value);
                              setError("");
                              setErrorField(null);
                            }}
                          />
                          {ingredients.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-ghost btn-square hover:bg-base-200 transition-colors duration-200"
                              onClick={() => handleRemoveIngredient(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {index < ingredients.length - 1 && (
                          <div className="my-3 border-b border-base-300" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost mt-2 gap-2 hover:bg-base-200 transition-all duration-200 group"
                    onClick={handleAddIngredient}
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
                      ref={instructionsInputRef}
                      id="instructions"
                      className={`textarea textarea-bordered h-36 w-full ${errorField === "instructions" ? "textarea-error" : ""}`}
                      value={instructions}
                      onChange={(e) => {
                        setInstructions(e.target.value);
                        setError("");
                        setErrorField(null);
                      }}
                      required
                    />
                    {errorField === "instructions" && <ErrorMessage message={error} />}
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
                      className={`select select-bordered w-full appearance-none ${errorField === "category" ? "select-error" : ""}`}
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setError("");
                        setErrorField(null);
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
                    {errorField === "category" && <ErrorMessage message={error} />}
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
                      className={`select select-bordered w-full appearance-none ${errorField === "glass" ? "select-error" : ""}`}
                      value={glass}
                      onChange={(e) => {
                        setGlass(e.target.value);
                        setError("");
                        setErrorField(null);
                      }}
                    >
                      <option value="">Select a glass type</option>
                      {glasses.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-base-content/70" />
                    {errorField === "glass" && <ErrorMessage message={error} />}
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
                      value={isAlcoholic}
                      onChange={(e) => setIsAlcoholic(e.target.value)}
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
                    tags={tags}
                    onChange={setTags}
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
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          navigate("/");
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
      />
    </div>
  );
}
