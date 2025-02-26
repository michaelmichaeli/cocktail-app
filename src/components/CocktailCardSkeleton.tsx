export function CocktailCardSkeleton() {
  return (
    <div className="card min-h-[24rem] bg-base-100 shadow-xl animate-pulse">
      <div className="h-64 w-full skeleton" />
      <div className="card-body">
        <div className="space-y-4">
          <div className="h-8 w-3/4 skeleton rounded" />
          <div className="space-y-3">
            <div className="h-5 w-1/2 skeleton rounded" />
            <div className="h-5 w-2/3 skeleton rounded" />
            <div className="h-5 w-1/2 skeleton rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
