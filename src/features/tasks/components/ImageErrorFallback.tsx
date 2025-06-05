
import { memo } from 'react';

interface ImageErrorFallbackProps {
  message?: string;
  description?: string;
}

function ImageErrorFallback({ 
  message = 'Failed to load image',
  description = 'Please check your connection and try again'
}: ImageErrorFallbackProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <span className="text-red-500 text-lg">{message}</span>
        <p className="text-gray-500 text-sm mt-2">{description}</p>
      </div>
    </div>
  );
}

export default memo(ImageErrorFallback);
