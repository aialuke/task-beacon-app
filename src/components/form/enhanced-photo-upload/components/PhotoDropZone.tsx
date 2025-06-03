/**
 * Photo Drop Zone Component
 * 
 * Self-contained drop zone component for file uploads.
 * Handles drag and drop interactions and file selection UI.
 */

import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils/shared';
import type { PhotoDropZoneProps } from '../types';

/**
 * Photo Drop Zone component
 */
export function PhotoDropZone({
  isDragging,
  onFileSelect,
  dragHandlers,
  animation,
  disabled = false,
  description,
  allowedTypes,
  maxFileSize,
  hasError,
  isComplete,
  onClick,
}: PhotoDropZoneProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  /**
   * Handle click to open file dialog
   */
  const handleClick = () => {
    if (!disabled) {
      // Use the passed onClick prop if available, otherwise open file dialog
      if (onClick) {
        onClick();
      } else {
        fileInputRef.current?.click();
      }
    }
  };

  return (
    <div className="relative">
      {/* Drop Zone */}
      <animated.div
        ref={dragHandlers.dropZoneRef}
        style={animation}
        onDrop={dragHandlers.onDrop}
        onDragOver={dragHandlers.onDragOver}
        onDragLeave={dragHandlers.onDragLeave}
        onClick={handleClick}
        className={cn(
          'relative flex flex-col items-center justify-center',
          'min-h-[200px] p-6 border-2 border-dashed rounded-lg',
          'cursor-pointer transition-colors duration-200',
          'hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
          {
            'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20': isDragging,
            'border-red-500 bg-red-50/50 dark:bg-red-950/20': hasError,
            'border-green-500 bg-green-50/50 dark:bg-green-950/20': isComplete,
            'cursor-not-allowed opacity-50': disabled,
            'pointer-events-none': disabled,
          }
        )}
      >
        {/* Upload Icon */}
        <Upload className={cn(
          'h-8 w-8 mb-2 transition-colors duration-200',
          {
            'text-blue-500': isDragging,
            'text-red-500': hasError,
            'text-green-500': isComplete,
            'text-gray-400': !isDragging && !hasError && !isComplete,
          }
        )} />

        {/* Main Description */}
        <p className="text-sm font-medium text-center mb-1">
          {isDragging ? 'Drop image here' : description}
        </p>

        {/* File Type and Size Info */}
        <p className="text-xs text-gray-500 text-center">
          Supports: {allowedTypes.map(type => type.split('/')[1]).join(', ')} • Max: {formatFileSize(maxFileSize)}
        </p>

        {/* Success State Additional Info */}
        {isComplete && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            ✅ File ready for upload
          </p>
        )}

        {/* Error State Additional Info */}
        {hasError && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            ❌ Please try a different file
          </p>
        )}
      </animated.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="sr-only"
        aria-label="Upload Image"
        disabled={disabled}
      />
    </div>
  );
} 