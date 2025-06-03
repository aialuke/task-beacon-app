/**
 * File Info Component
 * 
 * Displays detailed file information including metadata and validation results.
 * Shows file size, dimensions, format, and validation status.
 */

import { FileImage, Info } from 'lucide-react';
import { formatFileSize } from '@/lib/utils/shared';
import type { FileInfoProps } from '../types';

/**
 * File Info component
 */
export function FileInfo({
  fileState,
}: FileInfoProps) {
  
  const { file, metadata, validation } = fileState;

  if (!file) {
    return null;
  }

  return (
    <div className="mt-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
      {/* File Name Header */}
      <div className="flex items-center space-x-2 mb-2">
        <FileImage className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.name}
        </span>
      </div>

      {/* File Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
        {/* File Size */}
        <div>
          <span className="font-medium">Size:</span> {formatFileSize(file.size)}
        </div>

        {/* File Type */}
        <div>
          <span className="font-medium">Type:</span> {file.type || 'Unknown'}
        </div>

        {/* Dimensions (if available in metadata) */}
        {metadata && metadata.width && metadata.height && (
          <>
            <div>
              <span className="font-medium">Width:</span> {metadata.width}px
            </div>
            <div>
              <span className="font-medium">Height:</span> {metadata.height}px
            </div>
          </>
        )}

        {/* Color Space (if available) */}
        {metadata && metadata.colorSpace && (
          <div className="col-span-2">
            <span className="font-medium">Color Space:</span> {metadata.colorSpace}
          </div>
        )}

        {/* Has Alpha Channel (if available) */}
        {metadata && typeof metadata.hasAlphaChannel === 'boolean' && (
          <div className="col-span-2">
            <span className="font-medium">Transparency:</span> {metadata.hasAlphaChannel ? 'Yes' : 'No'}
          </div>
        )}

        {/* Megapixels (if available) */}
        {metadata && metadata.megapixels && (
          <div className="col-span-2">
            <span className="font-medium">Megapixels:</span> {metadata.megapixels.toFixed(1)}MP
          </div>
        )}
      </div>

      {/* Validation Status */}
      {validation && (
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Validation Status
            </span>
          </div>
          
          <div className="mt-1 text-xs">
            {validation.valid ? (
              <span className="text-green-600 dark:text-green-400">
                ✅ File is valid and ready for processing
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                ❌ {validation.error || 'File validation failed'}
              </span>
            )}
          </div>

          {/* Show validation warnings if available */}
          {validation.warnings && validation.warnings.length > 0 && (
            <div className="mt-1">
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-xs text-orange-600 dark:text-orange-400">
                  ⚠️ {warning}
                </div>
              ))}
            </div>
          )}

          {/* Show validation details if available */}
          {validation.details && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              <div>📄 File Size: {validation.details.fileSize}</div>
              <div>📐 Dimensions: {validation.details.dimensions}</div>
              <div>📷 Type: {validation.details.type}</div>
              <div>📏 Aspect Ratio: {validation.details.aspectRatio.toFixed(2)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 