import { ReactNode } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { CocktailCard } from './CocktailCard';
import { EmptyState } from './EmptyState';
import { CocktailWithIngredients } from '../types/cocktail';

interface CocktailGridProps {
  cocktails: CocktailWithIngredients[];
  isLoading: boolean;
  error: Error | null;
  title: string;
  emptyMessage?: string;
  headerContent?: ReactNode;
}

export function CocktailGrid({
  cocktails,
  isLoading,
  error,
  title,
  emptyMessage = 'No cocktails found',
  headerContent,
}: CocktailGridProps) {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {headerContent}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-base-content/70">Loading cocktails...</p>
        </div>
      ) : error ? (
        <EmptyState
          icon={<AlertCircle className="h-12 w-12 text-error" />}
          title="Something went wrong"
          message={error.message || 'Failed to load cocktails'}
        />
      ) : cocktails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <CocktailCard key={cocktail.id} cocktail={cocktail} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No cocktails found"
          message={emptyMessage}
        />
      )}
    </section>
  );
}
