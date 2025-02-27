export function FilterHeaderSkeleton() {
  return (
    <div className="flex items-start gap-4 mb-6 animate-pulse">
      <div className="w-36 h-36 bg-base-300 rounded"></div>
      <div className="space-y-4 flex-1">
        <div className="h-8 bg-base-300 rounded w-3/4"></div>
        <div className="h-6 bg-base-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}
