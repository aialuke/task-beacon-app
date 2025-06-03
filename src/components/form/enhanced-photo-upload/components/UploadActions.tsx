/**
 * Upload Actions Component
 * 
 * Provides action buttons for the upload process.
 * Handles confirm, remove, and cancel actions based on upload state.
 */

import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import type { UploadActionsProps } from '../types';

/**
 * Upload Actions component
 */
export function UploadActions({
  fileState,
  uploadState,
  currentImage,
  onConfirm,
  onRemove,
  onCancel,
}: UploadActionsProps) {
  
  const { file, processingResult } = fileState;
  const { isValidating, isProcessing, isComplete, hasError } = uploadState;

  const isProcessingActive = isValidating || isProcessing;
  const canConfirm = file && isComplete && !hasError && !isProcessingActive;
  const canRemove = (currentImage || file) && onRemove;

  return (
    <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
      
      {/* Cancel Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isProcessingActive}
        className="w-full sm:w-auto"
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>

      {/* Remove Button (if there's a current image) */}
      {canRemove && (
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          disabled={isProcessingActive}
          className="w-full sm:w-auto text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove Image
        </Button>
      )}

      {/* Confirm Button */}
      <Button
        type="button"
        onClick={onConfirm}
        disabled={!canConfirm}
        className="w-full sm:w-auto"
      >
        <Check className="h-4 w-4 mr-2" />
        {processingResult ? 'Use Processed Image' : 'Use Original Image'}
      </Button>
    </div>
  );
} 