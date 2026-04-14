export default function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full skeleton-shimmer" />
          <div className="flex flex-col gap-2">
            <div className="h-5 w-36 rounded-lg skeleton-shimmer" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full skeleton-shimmer" />
              <div className="h-5 w-10 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
          <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      <div className="pl-8 flex flex-col gap-2">
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-4 w-2/3 rounded skeleton-shimmer" />
      </div>
      <div className="pl-8">
        <div className="h-1 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
