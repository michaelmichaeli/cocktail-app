import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Maximize2, 
  Trash2, 
  UtensilsCrossed, 
  ScrollText, 
  Calendar, 
  Wine, 
  GlassWater, 
  CupSoda, 
  FolderKanban,  
  Tags
} from "lucide-react";
import { useRecipePage } from "../hooks/useRecipePage";
import { showToast } from "../lib/toast";
import { DeleteDialog } from "../components/DeleteDialog";
import DEFAULT_COCKTAIL_IMAGE from "../assets/default-cocktail.png";

export function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { 
    cocktail,
    isLoading,
    isCustom,
    deleteCustomCocktail,
    isDeletingCocktail
  } = useRecipePage(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!cocktail) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="card overflow-hidden w-96 bg-error bg-opacity-10 text-error">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">Not Found</h2>
            <p>Cocktail not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-6 py-8 min-h-screen">
      <div className="card overflow-hidden bg-base-100 shadow-xl p-6 md:p-8 h-full">
        <div className="grid grid-cols-1 md:grid-cols-[min(400px,35%)_1fr] gap-8">
          {/* Image Section */}
          <section className="relative group">
            <div className="h-50">
              <figure className="relative rounded-xl overflow-hidden shadow-xl h-full">
                <img
                  src={cocktail.imageUrl || DEFAULT_COCKTAIL_IMAGE}
                  alt={cocktail.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                />
                <button
                  onClick={() => {
                    const modal = document.getElementById('imageModal') as HTMLDialogElement;
                    modal?.showModal();
                  }}
                  className="btn btn-circle btn-ghost absolute top-2 right-2 bg-base-100/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-base-100 hover:scale-110"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </figure>

              <dialog id="imageModal" className="modal">
                <div className="modal-box max-w-5xl w-full p-0 bg-base-100 overflow-hidden">
                  <div className="relative">
                    <img
                      src={cocktail.imageUrl || DEFAULT_COCKTAIL_IMAGE}
                      alt={cocktail.name}
                      className="w-full max-h-[80vh] object-contain rounded-lg"
                    />
                    <button 
                      className="btn btn-sm btn-circle absolute right-2 top-2"
                      onClick={() => {
                        const modal = document.getElementById('imageModal') as HTMLDialogElement;
                        modal?.close();
                      }}
                    >✕</button>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop bg-base-100/90" />
              </dialog>
            </div>
          </section>

          {/* Content Section */}
          <section className="space-y-8">
            {/* Header */}
            <header className="border-b pb-6 mb-8">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-bold">{cocktail.name}</h1>
                {isCustom && (
                  <button
                    className="btn btn-error btn-sm gap-2"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`badge ${cocktail.isAlcoholic ? 'badge-secondary' : 'badge-primary'} gap-2 p-4 text-base font-medium`}>
                  {cocktail.isAlcoholic ? <Wine className="h-5 w-5" /> : <GlassWater className="h-5 w-5" />}
                  {cocktail.isAlcoholic ? 'Alcoholic' : 'Non-Alcoholic'}
                </span>
                <Link
                  to={`/by-category?c=${encodeURIComponent(cocktail.category || 'Unknown')}`}
                  className="badge badge-accent gap-2 p-4 text-base font-medium hover:brightness-110 transition-all"
                >
                  <FolderKanban className="h-5 w-5" />
                  {cocktail.category}
                </Link>
                <Link
                  to={`/by-glass?g=${encodeURIComponent(cocktail.glass || 'Unknown')}`}
                  className="badge badge-info gap-2 p-4 text-base font-medium hover:brightness-110 transition-all"
                >
                  <CupSoda className="h-5 w-5" />
                  {cocktail.glass}
                </Link>
              </div>
            </header>

            {/* Ingredients Section */}
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

            {/* Instructions Section */}
            <section className="card bg-base-200/50 p-6 rounded-xl hover:bg-base-200 transition-colors duration-300">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                Instructions
              </h2>
              <p className="text-base-content/70 whitespace-pre-line leading-relaxed">
                {cocktail.instructions}
              </p>
            </section>

            {/* Tags Section */}
            {(cocktail.tags || []).length > 0 && (
              <section className="card bg-base-200/50 p-6 rounded-xl hover:bg-base-200 transition-colors duration-300">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(cocktail.tags || []).map((tag, index) => (
                    <span key={index} className="badge badge-ghost gap-2 p-3 text-base">
                      <Tags className="h-4 w-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
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
            showToast("Cocktail deleted successfully", "success");
            navigate("/");
          }
        }}
        title="Delete Cocktail"
        message="Are you sure you want to delete this cocktail? This action cannot be undone."
      />
    </div>
  );
}
