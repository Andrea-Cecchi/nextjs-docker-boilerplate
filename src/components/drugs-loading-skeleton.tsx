import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function DrugsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="bg-muted h-4 w-32 animate-pulse rounded" />
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted h-8 w-8 rounded-lg" />
                  <div className="space-y-2">
                    <div className="bg-muted h-5 w-32 rounded" />
                    <div className="bg-muted h-4 w-24 rounded" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="bg-muted h-5 w-16 rounded" />
                  <div className="bg-muted h-4 w-20 rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-24 rounded" />
                  <div className="bg-muted h-4 w-full rounded" />
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-20 rounded" />
                  <div className="bg-muted h-4 w-3/4 rounded" />
                </div>
                <div className="border-t pt-4">
                  <div className="bg-muted h-10 w-full rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
