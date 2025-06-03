/**
 * Processing Status Component
 * 
 * Displays processing status with animated indicators.
 * Shows validation, processing, and completion states.
 */

import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import type { ProcessingStatusProps } from '../types';

/**
 * Processing Status component
 */
export function ProcessingStatus({
  uploadState,
  processingProgress,
  animation,
}: ProcessingStatusProps) {
  
  const { isValidating, isProcessing, isComplete, hasError } = uploadState;

  // Don't render if no processing is happening
  if (!isValidating && !isProcessing && !isComplete && !hasError) {
    return null;
  }

  return (
    <animated.div
      style={animation}
      className="mt-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
    >
      <div className="flex items-center space-x-2">
        {/* Status Icon */}
        {(isValidating || isProcessing) && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
        
        {isComplete && !hasError && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
        
        {hasError && (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}

        {/* Status Message */}
        <span className={cn(
          'text-sm font-medium',
          {
            'text-blue-600 dark:text-blue-400': isValidating || isProcessing,
            'text-green-600 dark:text-green-400': isComplete && !hasError,
            'text-red-600 dark:text-red-400': hasError,
          }
        )}>
          {processingProgress.message}
        </span>
      </div>

      {/* Progress Steps Indicator */}
      {(isValidating || isProcessing || isComplete) && !hasError && (
        <div className="mt-2 flex space-x-1">
          {/* Validation Step */}
          <div className={cn(
            'h-1 flex-1 rounded',
            processingProgress.stage === 'validation' ? 'bg-blue-500' : 'bg-green-500'
          )} />
          
          {/* Metadata Step */}
          <div className={cn(
            'h-1 flex-1 rounded',
            processingProgress.stage === 'validation' ? 'bg-gray-200 dark:bg-gray-600' :
            processingProgress.stage === 'metadata' ? 'bg-blue-500' : 'bg-green-500'
          )} />
          
          {/* Processing Step */}
          <div className={cn(
            'h-1 flex-1 rounded',
            processingProgress.stage === 'validation' || processingProgress.stage === 'metadata' ? 'bg-gray-200 dark:bg-gray-600' :
            processingProgress.stage === 'processing' ? 'bg-blue-500' : 'bg-green-500'
          )} />
          
          {/* Complete Step */}
          <div className={cn(
            'h-1 flex-1 rounded',
            processingProgress.stage === 'complete' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
          )} />
        </div>
      )}
    </animated.div>
  );
} 