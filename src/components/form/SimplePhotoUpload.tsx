import { ImageUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import type { ProcessingResult } from '@/lib/utils/image/types';

interface SimplePhotoUploadProps {
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  processingResult?: ProcessingResult | null;
  loading?: boolean;
}

export function SimplePhotoUpload({
  photoPreview,
  onPhotoChange,
  onPhotoRemove,
  onSubmit,
  disabled = false,
  processingResult,
  loading = false,
}: SimplePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          className="border-input relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border"
          aria-label={
            photoPreview ? "Preview of uploaded image" : "Default image placeholder"
          }
        >
          {photoPreview ? (
            <img
              className="size-full object-cover"
              src={photoPreview}
              alt="Preview of uploaded image"
              width={32}
              height={32}
            />
          ) : (
            <div aria-hidden="true">
              <ImageUp className="opacity-60" size={16} />
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Upload/Submit button */}
        <div className="relative inline-block">
          <Button 
            onClick={handleButtonClick} 
            aria-haspopup={!photoPreview ? "dialog" : undefined}
            disabled={disabled || loading}
            size="default"
            variant="default"
          >
            {photoPreview ? "Submit" : "Upload image"}
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
          <p className="text-muted-foreground truncate max-w-32" aria-live="polite">
            {fileName}
          </p>
          {onPhotoRemove && (
            <button
              onClick={onPhotoRemove}
              className="text-destructive font-medium hover:underline"
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
