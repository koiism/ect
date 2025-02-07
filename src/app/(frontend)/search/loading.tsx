export default function SearchLoading() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto mb-16">
          {/* Search Input Skeleton */}
          <div className="h-12 w-full bg-muted-foreground/20 rounded-lg mb-8" />

          {/* Title Skeleton */}
          <div className="h-8 w-64 bg-muted-foreground/20 rounded mb-8" />
        </div>

        {/* Results Skeleton */}
        <div className="space-y-16">
          {/* Products Section */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted-foreground/20 rounded-lg mb-4" />
                  <div className="h-6 w-3/4 bg-muted-foreground/20 rounded mb-2" />
                  <div className="h-4 w-1/4 bg-muted-foreground/20 rounded" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
