import { ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-base-200 py-6 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <p className="text-base-content/80 mb-2">© {new Date().getFullYear()} Cocktail App</p>
        </div>
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <p className="text-base-content/80">
            Powered by TheCocktailDB
          </p>
          <a 
            href="https://www.thecocktaildb.com/api.php" 
            target="_blank" 
            rel="noopener noreferrer"
            className="link link-primary inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            API Documentation
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
