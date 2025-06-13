import { ImageUp } from 'lucide-react';
import { useRef } from 'react';

import { useImageLoadingState } from '@/hooks/core';
import { Button } from '@/shared/components/ui/button';
import type { ProcessingResult } from '@/shared/utils/image/';

interface SimplePhotoUploadProps {
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  processingResult?: ProcessingResult | null;
  loading?: boolean;
}

export default function SimplePhotoUpload({
  photoPreview,
  onPhotoChange,
  onPhotoRemove,
  onSubmit,
  disabled = false,
  processingResult,
  loading = false,
}: SimplePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imageLoaded, imageError, handleImageLoad, handleImageError } =
    useImageLoadingState();

  const handleButtonClick = () => {
    if (photoPreview && onSubmit) {
      onSubmit();
    } else {
      fileInputRef.current?.click();
    }
  };

  const fileName = processingResult?.metadata?.name || 'Uploaded image';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-flex items-center gap-6 align-top">
        {/* Preview box */}
        <div
          className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-input"
          aria-label={
            photoPreview
              ? 'Preview of uploaded image'
              : 'Default image placeholder'
          }
        >
          {photoPreview ? (
            <div className="relative size-full">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="size-3 animate-spin rounded-full border border-primary border-t-transparent" />
                </div>
              )}
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <ImageUp className="opacity-40" size={12} />
                </div>
              )}
              <img
                className={`size-full object-cover transition-opacity duration-200 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                src={photoPreview}
                alt="Preview of uploaded file"
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                sizes="64px"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          ) : (
            <div aria-hidden="true">
              <ImageUp className="opacity-60" size={16} />
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="size-3 animate-spin rounded-full border border-primary border-t-transparent" />
            </div>
          )}
        </div>

        {/* Upload/Submit button */}
        <div className="relative inline-block">
          <Button
            onClick={handleButtonClick}
            aria-haspopup={!photoPreview ? 'dialog' : undefined}
            disabled={disabled || loading}
            size="default"
            variant="default"
          >
            {photoPreview ? 'Submit' : 'Upload image'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="sr-only"
            aria-label="Upload image file"
            tabIndex={-1}
          />
        </div>
      </div>

      {/* File info and remove option */}
      {photoPreview && fileName && (
        <div className="inline-flex gap-2 text-xs">
          <p
            className="max-w-32 truncate text-muted-foreground"
            aria-live="polite"
          >
            {fileName}
          </p>
          {onPhotoRemove && (
            <button
              onClick={onPhotoRemove}
              className="font-medium text-destructive hover:underline"
              aria-label={`Remove ${fileName}`}
              disabled={disabled || loading}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Note: Named export SimplePhotoUpload removed as unused
