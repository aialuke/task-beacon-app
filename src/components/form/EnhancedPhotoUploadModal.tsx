import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle, ImageIcon, FileText, Loader2 } from 'lucide-react';
import { useSpring, animated, config } from '@react-spring/web';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  validateImageEnhanced,
  processImageEnhanced,
  extractImageMetadataEnhanced,
  createImagePreviewEnhanced,
  type ValidationResult,
  type ProcessingResult,
  type ImageMetadata,
  type EnhancedImageProcessingOptions 
} from '@/lib/utils/image';
import { formatFileSize } from '@/lib/utils/shared';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface EnhancedPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (file: File, processedResult?: ProcessingResult) => void;
  onImageRemove?: () => void;
  currentImage?: File | null;
  maxFileSize?: number;
  allowedTypes?: string[];
  processingOptions?: EnhancedImageProcessingOptions;
  autoProcess?: boolean;
  showPreview?: boolean;
  title?: string;
  description?: string;
}

interface UploadState {
  isDragging: boolean;
  isValidating: boolean;
  isProcessing: boolean;
  isComplete: boolean;
  hasError: boolean;
}

interface FileValidationState {
  file: File | null;
  validation: ValidationResult | null;
  metadata: ImageMetadata | null;
  processingResult: ProcessingResult | null;
  preview: { url: string; revoke: () => void } | null;
  error: string | null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EnhancedPhotoUploadModal({
  isOpen,
  onClose,
  onImageSelect,
  onImageRemove,
  currentImage = null,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  processingOptions = {},
  autoProcess = true,
  showPreview = true,
  title = 'Upload Image',
  description = 'Drag and drop an image or click to browse',
}: EnhancedPhotoUploadModalProps) {
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isDragging: false,
    isValidating: false,
    isProcessing: false,
    isComplete: false,
    hasError: false,
  });

  const [fileState, setFileState] = useState<FileValidationState>({
    file: null,
    validation: null,
    metadata: null,
    processingResult: null,
    preview: null,
    error: null,
  });

  const [processingProgress, setProcessingProgress] = useState<{
    stage: 'validation' | 'metadata' | 'processing' | 'complete';
    message: string;
  }>({
    stage: 'validation',
    message: 'Ready to upload',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const dropZoneAnimation = useSpring({
    scale: uploadState.isDragging ? 1.02 : 1,
    borderColor: uploadState.isDragging 
      ? '#3b82f6' 
      : uploadState.hasError 
        ? '#ef4444'
        : uploadState.isComplete
          ? '#10b981'
          : '#6b7280',
    backgroundColor: uploadState.isDragging 
      ? 'rgba(59, 130, 246, 0.05)'
      : 'rgba(255, 255, 255, 0.01)',
    config: config.gentle,
  });

  const previewAnimation = useSpring({
    opacity: fileState.preview ? 1 : 0,
    transform: fileState.preview ? 'scale(1)' : 'scale(0.9)',
    config: config.default,
  });

  const progressAnimation = useSpring({
    opacity: uploadState.isValidating || uploadState.isProcessing ? 1 : 0,
    transform: uploadState.isValidating || uploadState.isProcessing 
      ? 'translateY(0px)' 
      : 'translateY(10px)',
    config: config.default,
  });

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const resetState = useCallback(() => {
    setUploadState({
      isDragging: false,
      isValidating: false,
      isProcessing: false,
      isComplete: false,
      hasError: false,
    });

    if (fileState.preview) {
      fileState.preview.revoke();
    }

    setFileState({
      file: null,
      validation: null,
      metadata: null,
      processingResult: null,
      preview: null,
      error: null,
    });

    setProcessingProgress({
      stage: 'validation',
      message: 'Ready to upload',
    });
  }, [fileState.preview]);

  const updateProcessingProgress = useCallback((stage: typeof processingProgress.stage, message: string) => {
    setProcessingProgress({ stage, message });
  }, []);

  // ============================================================================
  // FILE PROCESSING
  // ============================================================================

  const processFile = useCallback(async (file: File) => {
    try {
      setUploadState(prev => ({ ...prev, isValidating: true, hasError: false }));
      updateProcessingProgress('validation', 'Validating image...');

      // Step 1: Validate the file
      const validation = await validateImageEnhanced(file, {
        maxSize: maxFileSize,
        allowedTypes,
      });

      setFileState(prev => ({ ...prev, validation }));

      if (!validation.valid) {
        setUploadState(prev => ({ 
          ...prev, 
          isValidating: false, 
          hasError: true 
        }));
        setFileState(prev => ({ ...prev, error: validation.error || 'Invalid file' }));
        updateProcessingProgress('validation', validation.error || 'Validation failed');
        return;
      }

      // Step 2: Extract metadata
      updateProcessingProgress('metadata', 'Analyzing image properties...');
      const metadata = await extractImageMetadataEnhanced(file);
      setFileState(prev => ({ ...prev, metadata }));

      // Step 3: Create preview
      const preview = createImagePreviewEnhanced(file, false); // Manual cleanup
      setFileState(prev => ({ ...prev, preview }));

      setUploadState(prev => ({ ...prev, isValidating: false }));

      // Step 4: Process image if auto-processing is enabled
      if (autoProcess) {
        setUploadState(prev => ({ ...prev, isProcessing: true }));
        updateProcessingProgress('processing', 'Optimizing image...');

        const processingResult = await processImageEnhanced(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.85,
          format: 'auto',
          ...processingOptions,
        });

        setFileState(prev => ({ ...prev, processingResult }));
        updateProcessingProgress('complete', 'Image optimized successfully!');
        
        setUploadState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          isComplete: true 
        }));
      } else {
        setUploadState(prev => ({ ...prev, isComplete: true }));
        updateProcessingProgress('complete', 'Image ready for upload');
      }

      setFileState(prev => ({ ...prev, file }));

    } catch (error) {
      console.error('Error processing file:', error);
      setUploadState(prev => ({ 
        ...prev, 
        isValidating: false, 
        isProcessing: false, 
        hasError: true 
      }));
      setFileState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to process image' 
      }));
      updateProcessingProgress('validation', 'Processing failed');
    }
  }, [maxFileSize, allowedTypes, processingOptions, autoProcess, updateProcessingProgress]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    resetState();
    processFile(file);
  }, [resetState, processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState(prev => ({ ...prev, isDragging: false }));
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!uploadState.isDragging) {
      setUploadState(prev => ({ ...prev, isDragging: true }));
    }
  }, [uploadState.isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set isDragging to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setUploadState(prev => ({ ...prev, isDragging: false }));
    }
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleConfirm = useCallback(() => {
    if (fileState.file) {
      onImageSelect(fileState.file, fileState.processingResult || undefined);
      onClose();
    }
  }, [fileState.file, fileState.processingResult, onImageSelect, onClose]);

  const handleRemove = useCallback(() => {
    resetState();
    onImageRemove?.();
  }, [resetState, onImageRemove]);

  const handleCancel = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // ============================================================================
  // CLEANUP EFFECTS
  // ============================================================================

  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (fileState.preview) {
        fileState.preview.revoke();
      }
    };
  }, [fileState.preview]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(resetState, 300); // Allow for close animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, resetState]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderProcessingStatus = () => {
    const getStatusIcon = () => {
      if (uploadState.hasError) {
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      }
      if (uploadState.isComplete) {
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      }
      if (uploadState.isValidating || uploadState.isProcessing) {
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      }
      return <Upload className="h-4 w-4 text-gray-500" />;
    };

    const getStatusColor = () => {
      if (uploadState.hasError) return 'text-red-500';
      if (uploadState.isComplete) return 'text-green-500';
      if (uploadState.isValidating || uploadState.isProcessing) return 'text-blue-500';
      return 'text-gray-500';
    };

    return (
      <animated.div 
        style={progressAnimation}
        className="flex items-center gap-2 text-sm"
      >
        {getStatusIcon()}
        <span className={getStatusColor()}>
          {processingProgress.message}
        </span>
      </animated.div>
    );
  };

  const renderFileInfo = () => {
    if (!fileState.file || !fileState.metadata) return null;

    const { metadata, validation, processingResult } = fileState;

    return (
      <div className="space-y-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{metadata.name}</p>
            <p className="text-xs text-gray-500">
              {metadata.width}×{metadata.height} • {formatFileSize(metadata.size)} • {metadata.type}
            </p>
          </div>
        </div>

        {validation?.warnings && validation.warnings.length > 0 && (
          <div className="space-y-1">
            {validation.warnings.map((warning, index) => (
              <p key={index} className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ {warning}
              </p>
            ))}
          </div>
        )}

        {processingResult && (
          <div className="text-xs space-y-1">
            <p className="text-green-600 dark:text-green-400">
              ✅ Optimized: {processingResult.compressionStats.sizeSavedPercent.toFixed(1)}% size reduction
            </p>
            <p className="text-gray-500">
              Processing time: {processingResult.processingTime.toFixed(0)}ms
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    if (!showPreview || !fileState.preview) return null;

    return (
      <animated.div 
        style={previewAnimation}
        className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <img
          src={fileState.preview.url}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </animated.div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <animated.div
            ref={dropZoneRef}
            style={dropZoneAnimation}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className={cn(
              'relative flex flex-col items-center justify-center',
              'min-h-[200px] p-6 border-2 border-dashed rounded-lg',
              'cursor-pointer transition-colors duration-200',
              'hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
              uploadState.isDragging && 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
              uploadState.hasError && 'border-red-500 bg-red-50/50 dark:bg-red-950/20',
              uploadState.isComplete && 'border-green-500 bg-green-50/50 dark:bg-green-950/20'
            )}
          >
            <Upload className={cn(
              'h-8 w-8 mb-2',
              uploadState.isDragging ? 'text-blue-500' : 'text-gray-400'
            )} />
            <p className="text-sm font-medium text-center">
              {uploadState.isDragging ? 'Drop image here' : description}
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Supports: {allowedTypes.map(type => type.split('/')[1]).join(', ')} • Max: {formatFileSize(maxFileSize)}
            </p>
          </animated.div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="sr-only"
            aria-label="Upload Image"
          />

          {/* Processing Status */}
          {renderProcessingStatus()}

          {/* Error Display */}
          {fileState.error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {fileState.error}
              </p>
            </div>
          )}

          {/* Preview */}
          {renderPreview()}

          {/* File Info */}
          {renderFileInfo()}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            
            {fileState.file && uploadState.isComplete && (
              <>
                {currentImage && (
                  <Button variant="outline" onClick={handleRemove}>
                    Remove Current
                  </Button>
                )}
                <Button onClick={handleConfirm}>
                  {currentImage ? 'Replace Image' : 'Add Image'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 