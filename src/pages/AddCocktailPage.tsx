import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { showToast } from "../lib/toast";
import { CustomCocktail } from "../types/cocktail";
import { ImageUpload } from "../components/ImageUpload";
import { DeleteDialog } from "../components/DeleteDialog";
import { TagInput } from "../components/TagInput";
import DEFAULT_COCKTAIL_IMAGE from "../../public/default-cocktail.png";

export function AddCocktailPage() {
  const navigate = useNavigate();
  const { addCustomCocktail, isAddingCocktail } = useCocktails();

  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string; unitOfMeasure: string }>>([
    { name: "", amount: "", unitOfMeasure: "" }
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [glass, setGlass] = useState("");
  const [isAlcoholic, setIsAlcoholic] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"name" | "ingredients" | "instructions" | "category" | "glass" | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
  const ingredientInputRef = useRef<HTMLInputElement>(null);
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
      isAlcoholic,
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
                    <span className="label-text">Image</span>
                  </label>
                  <ImageUpload
                    onImageSelect={(file) => setImageFile(file)}
                    onImageClear={() => setImageFile(null)}
                  />
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="name">
                    <span className="label-text">Name</span>
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
                    <span className="label-text">Ingredients</span>
                  </label>
                  {errorField === "ingredients" && <ErrorMessage message={error} />}
                  <div>
                    {ingredients.map((ingredient, index) => (
                      <div key={index}>
                        <div className="flex flex-wrap gap-3">
                        <input
                          type="text"
                          ref={index === 0 ? ingredientInputRef : undefined}
                          placeholder="Ingredient"
                          className={`input input-bordered w-full sm:w-auto sm:flex-1 ${errorField === "ingredients" ? "input-error" : ""}`}
                          value={ingredient.name}
                          onChange={(e) => {
                            handleIngredientChange(index, "name", e.target.value);
                            setError("");
                            setErrorField(null);
                          }}
                        />
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
                    <span className="label-text">Instructions</span>
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
                    <span className="label-text">Category</span>
                  </label>
                  <div>
                    <select
                      id="category"
                      className={`select select-bordered w-full ${errorField === "category" ? "select-error" : ""}`}
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setError("");
                        setErrorField(null);
                      }}
                    >
                      <option value="">Select a category</option>
                      <option value="Cocktail">Cocktail</option>
                      <option value="Shot">Shot</option>
                      <option value="Punch / Party Drink">Punch / Party Drink</option>
                      <option value="Coffee / Tea">Coffee / Tea</option>
                      <option value="Other/Unknown">Other/Unknown</option>
                    </select>
                    {errorField === "category" && <ErrorMessage message={error} />}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="glass">
                    <span className="label-text">Glass Type</span>
                  </label>
                  <div>
                    <select
                      id="glass"
                      className={`select select-bordered w-full ${errorField === "glass" ? "select-error" : ""}`}
                      value={glass}
                      onChange={(e) => {
                        setGlass(e.target.value);
                        setError("");
                        setErrorField(null);
                      }}
                    >
                      <option value="">Select a glass type</option>
                      <option value="Highball glass">Highball glass</option>
                      <option value="Cocktail glass">Cocktail glass</option>
                      <option value="Old-fashioned glass">Old-fashioned glass</option>
                      <option value="Collins glass">Collins glass</option>
                      <option value="Shot glass">Shot glass</option>
                      <option value="Margarita glass">Margarita glass</option>
                      <option value="Other/Unknown">Other/Unknown</option>
                    </select>
                    {errorField === "glass" && <ErrorMessage message={error} />}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={isAlcoholic}
                      onChange={(e) => setIsAlcoholic(e.target.checked)}
                    />
                    <span className="label-text">Contains Alcohol</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="tags">
                    <span className="label-text">Tags</span>
                  </label>
                  <TagInput
                    tags={tags}
                    onChange={setTags}
                    placeholder="Enter a tag and press Enter or click Add Tag"
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary w-full ${
                    isAddingCocktail ? "loading" : ""
                  }`}
                  disabled={isAddingCocktail}
                >
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
