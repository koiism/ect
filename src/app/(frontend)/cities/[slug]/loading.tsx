export default function CityLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative h-[70vh] w-full bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-6 py-12">
            <div className="h-12 w-64 bg-muted-foreground/20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-6 py-16">
        {/* Description Skeleton */}
        <div className="mb-16">
          <div className="w-24 h-1 mb-8 rounded-full bg-muted-foreground/20" />
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-muted-foreground/20 rounded" />
            <div className="h-6 w-1/2 bg-muted-foreground/20 rounded" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-muted-foreground/20 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
