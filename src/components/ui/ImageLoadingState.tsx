import { memo } from 'react';

import { LoadingSpinner } from '@/components/ui/loading/UnifiedLoadingStates';

interface ImageLoadingStateProps {
  message?: string;
}

function ImageLoadingState({
  message = 'Loading image...',
}: ImageLoadingStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}

export default memo(ImageLoadingState);
