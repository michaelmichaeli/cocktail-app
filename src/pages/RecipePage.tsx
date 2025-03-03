import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UtensilsCrossed, ScrollText, Calendar, Tags } from "lucide-react";
import { useRecipePage } from "../hooks/useRecipePage";
import { toast } from "../lib/toast";
import { DeleteDialog } from "../components/ui/DeleteDialog";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { ImageWithModal } from "../components/ImageWithModal";
import { RecipeHeader } from "../components/RecipeHeader";
import { AlcoholicType } from "../types/features/cocktails";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { 
    cocktail,
    isLoading,
    isCustom = false,
    deleteCustomCocktail,
    isDeletingCocktail
  } = useRecipePage(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!cocktail) {
    return <ErrorState title="Not Found" message="Cocktail not found." />;
  }

  return (
    <div className="container max-w-5xl mx-auto px-6 py-8 min-h-screen">
      <div className="card overflow-hidden bg-base-100 shadow-xl p-6 md:p-8 h-full">
        <div className="grid grid-cols-1 md:grid-cols-[min(400px,35%)_1fr] gap-8">
          <section>
            <ImageWithModal
              src={cocktail.imageUrl || DEFAULT_COCKTAIL_IMAGE}
              alt={cocktail.name}
            />
          </section>

          <section className="space-y-8">
            <RecipeHeader
              name={cocktail.name}
              isCustom={isCustom}
              alcoholicType={cocktail.alcoholicType as AlcoholicType}
              category={cocktail.category}
              glass={cocktail.glass}
              onDelete={() => setShowDeleteDialog(true)}
            />

            <section className="card bg-base-200/50 p-6 rounded-xl hover:bg-base-200 transition-colors duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                Ingredients
              </h2>
              <ul className="grid gap-4">
                {cocktail.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Link 
                      to={`/by-ingredient?i=${encodeURIComponent(ingredient.name)}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <img
                        src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredient.name)}-Small.png`}
                        alt={ingredient.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span>
                        {`${ingredient.name}${ingredient.amount ? ` - ${ingredient.amount} ${ingredient.unitOfMeasure}` : ''}`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card bg-base-200/50 p-6 rounded-xl hover:bg-base-200 transition-colors duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                Instructions
              </h2>
              <p className="text-base-content/70 whitespace-pre-line leading-relaxed">
                {cocktail.instructions}
              </p>
            </section>

            {(cocktail.tags || []).length > 0 && (
              <section className="card bg-base-200/50 p-6 rounded-xl hover:bg-base-200 transition-colors duration-300">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(cocktail.tags || []).map((tag: string, index: number) => (
                    <span key={index} className="badge badge-ghost gap-2 p-3 text-base">
                      <Tags className="h-4 w-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <footer className="text-xs text-base-content/50 flex items-center gap-1 pt-4 border-t">
              <Calendar className="h-3 w-3" />
              Last modified: {new Date(cocktail.dateModified).toLocaleDateString()}
            </footer>
          </section>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={async () => {
          if (!isDeletingCocktail) {
            await deleteCustomCocktail(cocktail.id);
            toast.success("Cocktail deleted successfully");
            navigate("/");
          }
        }}
        title="Delete Cocktail"
        message="Are you sure you want to delete this cocktail? This action cannot be undone."
      />
    </div>
  );
}
