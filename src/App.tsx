import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AddCocktailPage } from './pages/AddCocktailPage';
import { RecipePage } from './pages/RecipePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddCocktailPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
