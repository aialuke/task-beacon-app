/**
 * Photo Preview Component
 * 
 * Displays a preview of the uploaded image with animations.
 * Shows image preview when a file is selected and validated.
 */

import { animated } from '@react-spring/web';
import type { PhotoPreviewProps } from '../types';

/**
 * Photo Preview component
 */
export function PhotoPreview({
  preview,
  animation,
  showPreview,
}: PhotoPreviewProps) {
  
  if (!showPreview || !preview) {
    return null;
  }

  return (
    <animated.div
      style={animation}
      className="mt-4 flex justify-center"
    >
      <div className="relative max-w-xs">
        <img
          src={preview.url}
          alt="Preview"
          className="max-w-full max-h-48 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
        />
        
        {/* Optional overlay for additional controls */}
        <div className="absolute inset-0 rounded-lg bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          {/* Future: Add preview controls like zoom, rotate, etc. */}
        </div>
      </div>
    </animated.div>
  );
} 