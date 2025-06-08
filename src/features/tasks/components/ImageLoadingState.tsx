
import { memo } from 'react';

interface ImageLoadingStateProps {
  message?: string;
}

function ImageLoadingState({ message = 'Loading image...' }: ImageLoadingStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600">{message}</span>
      </div>
    </div>
  );
}

export default memo(ImageLoadingState);
// CodeRabbit review
