
import { Skeleton } from '@/components/ui/skeleton';

interface PageLoaderProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'dashboard';
}

export function PageLoader({ 
  message = "Loading page...", 
  variant = 'default' 
}: PageLoaderProps) {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="space-y-6 p-6">
        {/* Header skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Filter navbar skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-22" />
        </div>

        {/* Content skeleton */}
        <div className="flex justify-center">
          <div className="space-y-6 max-w-4xl w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border-2 border-border/40 bg-muted/20 p-4 sm:p-5 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-6 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{message}</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load the content</p>
        </div>
      </div>
    </div>
  );
}
