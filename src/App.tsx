import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AddCocktailPage } from './pages/AddCocktailPage';
import { RecipePage } from './pages/RecipePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { LiveAnnouncer } from './components/LiveAnnouncer';
import { Navbar } from './components/Navbar'; // Import the Navbar

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-4 focus:bg-base-100 focus:shadow-lg focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Skip to main content
        </a>

        <LiveAnnouncer />

        <main id="main-content" className="flex-1" tabIndex={-1}>
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
