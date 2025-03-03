import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useFiltersStore } from "./store/filters";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { AddCocktailPage } from "./pages/AddCocktailPage";
import { RecipePage } from "./pages/RecipePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { IngredientPage } from "./pages/IngredientPage";
import { GlassPage } from "./pages/GlassPage";
import { CategoryPage } from "./pages/CategoryPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { toast } from "./lib/toast";
import { LoadingState } from "./components/LoadingState";

function App() {
  const { fetchFilters, isLoading } = useFiltersStore();

  useEffect(() => {
    const init = async () => {
      try {
        await fetchFilters();
      } catch (error) {
        toast.error('Failed to initialize app: ' + error);
      }
    };
    init();
  }, [fetchFilters]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Router>
      <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2" />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pb-6">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/by-ingredient" element={<IngredientPage />} />
            <Route path="/by-glass" element={<GlassPage />} />
            <Route path="/by-category" element={<CategoryPage />} />
            <Route path="/add" element={<AddCocktailPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
