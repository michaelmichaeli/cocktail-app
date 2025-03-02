export function FilteredCocktailsHeaderSkeleton() {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="skeleton w-36 h-36 rounded" />
      <div>
        <h1 className="skeleton h-10 w-96 mb-2" />
        <p className="skeleton h-8 w-80" />
      </div>
    </div>
  );
}
