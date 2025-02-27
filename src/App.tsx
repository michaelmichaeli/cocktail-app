import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AddCocktailPage } from "./pages/AddCocktailPage";
import { RecipePage } from "./pages/RecipePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { IngredientPage } from "./pages/IngredientPage";
import { GlassPage } from "./pages/GlassPage";
import { CategoryPage } from "./pages/CategoryPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pb-6">
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
