import { ExternalLink } from "lucide-react";
import { useCocktails } from "../hooks/useCocktails";
import { CocktailGrid } from "../components/CocktailGrid";
import { SearchInput } from "../components/SearchInput";

export function HomePage() {
	const {
		randomSuggestions,
		isLoadingRandomSuggestions,
		customCocktails,
		isLoadingCustomCocktails,
		randomError,
		nonAlcoholicCocktails,
		isLoadingNonAlcoholic,
		nonAlcoholicError,
		ingredientCocktails,
		isLoadingIngredient,
		ingredientError,
		selectedIngredient,
		categoryCocktails,
		isLoadingCategory,
		categoryError,
		selectedCategory,
		glassCocktails,
		isLoadingGlass,
		glassError,
		selectedGlass,
	} = useCocktails("");

	return (
		<div className="container mx-auto p-6 space-y-12">
			<header className="relative max-w-xl mx-auto z-10 space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold mb-3">Welcome to Cocktail App</h1>
					<p className="text-base-content/80 mb-2">
						Discover and explore a vast collection of cocktail recipes powered
						by TheCocktailDB. Search for your favorite drinks, get inspired by
						random suggestions and browse through extensive collection.
					</p>
					<a
						href="https://www.thecocktaildb.com/api.php"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm link link-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
					>
						Browse API Documentation
						<ExternalLink className="h-3 w-3" />
					</a>
				</div>
				<SearchInput />
			</header>

			<main className="relative z-0 space-y-16">
				<CocktailGrid
					title="My Custom Cocktails"
					cocktails={customCocktails.slice(0, 4)}
					isLoading={isLoadingCustomCocktails}
					error={null}
					emptyMessage="You haven't created any custom cocktails yet"
				/>

				<CocktailGrid
					title="Non-Alcoholic Cocktails"
					cocktails={nonAlcoholicCocktails.slice(0, 4)}
					isLoading={isLoadingNonAlcoholic}
					error={nonAlcoholicError}
					emptyMessage="No non-alcoholic cocktails found"
				/>

				<CocktailGrid
					title={`Cocktails in ${selectedCategory} Category`}
					cocktails={categoryCocktails.slice(0, 4)}
					isLoading={isLoadingCategory}
					error={categoryError}
					emptyMessage={`No cocktails found in ${selectedCategory}`}
				/>

				<CocktailGrid
					title={`Cocktails in ${selectedGlass}`}
					cocktails={glassCocktails.slice(0, 4)}
					isLoading={isLoadingGlass}
					error={glassError}
					emptyMessage={`No cocktails found in ${selectedGlass}`}
				/>

				<CocktailGrid
					title={`Cocktails with ${selectedIngredient} Ingredient`}
					cocktails={ingredientCocktails.slice(0, 4)}
					isLoading={isLoadingIngredient}
					error={ingredientError}
					emptyMessage={`No cocktails found with ${selectedIngredient}`}
				/>

				<CocktailGrid
					title={"Random Cocktails"}
					cocktails={randomSuggestions.slice(0, 4)}
					isLoading={isLoadingRandomSuggestions}
					error={randomError}
					emptyMessage={`No cocktails found with ${selectedIngredient}`}
				/>
			</main>
		</div>
	);
}
