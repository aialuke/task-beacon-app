
import { useState, useRef } from 'react';
import { User, ImageUp, Link, FileCheck } from 'lucide-react';
import { DatePickerButton } from './components/DatePickerButton';
import { ActionButton } from './components/ActionButton';
import { SubmitButton } from './components/SubmitButton';
import { UrlInputModal } from './UrlInputModal';
import { UserSearchModal } from './UserSearchModal';
import EnhancedPhotoUploadModal from './enhanced-photo-upload/EnhancedPhotoUploadModal';
import type { ProcessingResult } from '@/lib/utils/image/types';

interface QuickActionBarProps {
  // Date picker props
  dueDate: string;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // User assignment props
  assigneeId: string;
  onAssigneeChange: (value: string) => void;

  // Photo upload props - legacy support for backward compatibility
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photoPreview: string | null;

  // Enhanced photo upload props
  isPhotoModalOpen?: boolean;
  onPhotoModalOpen?: () => void;
  onPhotoModalClose?: () => void;
  onModalPhotoSelect?: (file: File, processedResult?: ProcessingResult) => void;
  onPhotoRemove?: () => void;

  // URL props
  url: string;
  onUrlChange: (value: string) => void;

  // Submit props
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;

  disabled?: boolean;
}

export function QuickActionBar({
  dueDate,
  onDueDateChange,
  assigneeId,
  onAssigneeChange,
  onPhotoChange,
  photoPreview,
  isPhotoModalOpen = false,
  onPhotoModalOpen,
  onPhotoModalClose,
  onModalPhotoSelect,
  onPhotoRemove,
  url,
  onUrlChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Share Task',
  disabled = false,
}: QuickActionBarProps) {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasUrl = !!url;
  const hasPhoto = !!photoPreview;
  const hasAssignee = !!assigneeId;

  const handlePhotoClick = () => {
    if (onPhotoModalOpen && onPhotoModalClose && onModalPhotoSelect) {
      // Use enhanced modal upload (preferred)
      onPhotoModalOpen();
    } else {
      // Fallback to legacy file input for backward compatibility
      fileInputRef.current?.click();
    }
  };

  // Determine if we should use enhanced upload or legacy
  const useEnhancedUpload = !!(onPhotoModalOpen && onPhotoModalClose && onModalPhotoSelect);

  return (
    <div className="flex items-center justify-center gap-4 rounded-xl bg-background/30 px-4 py-1.5 backdrop-blur-sm">
      {/* Action buttons container */}
      <div className="flex items-center gap-3">
        {/* Date Picker Button */}
        <DatePickerButton
          dueDate={dueDate}
          onDueDateChange={onDueDateChange}
          disabled={disabled}
        />

        {/* Assignee Button */}
        <ActionButton
          icon={User}
          label={hasAssignee ? 'Assigned' : 'Assign'}
          active={hasAssignee}
          disabled={disabled}
          onClick={() => setIsUserModalOpen(true)}
        />

        {/* Photo Button */}
        <ActionButton
          icon={ImageUp}
          label={hasPhoto ? 'Photo Added' : 'Attach'}
          active={hasPhoto}
          disabled={disabled}
          onClick={handlePhotoClick}
        />

        {/* URL Button */}
        <ActionButton
          icon={hasUrl ? FileCheck : Link}
          label={hasUrl ? 'Link Added' : 'Link'}
          active={hasUrl}
          disabled={disabled}
          onClick={() => setIsUrlModalOpen(true)}
        />
      </div>

      {/* Submit Button */}
      <SubmitButton
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        disabled={disabled}
      />

      {/* Hidden file input - for legacy compatibility when modal props not provided */}
      {!useEnhancedUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
          className="sr-only"
          aria-label="Upload Image"
        />
      )}

      {/* Modals */}
      <UrlInputModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        value={url}
        onChange={onUrlChange}
      />

      <UserSearchModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        value={assigneeId}
        onChange={onAssigneeChange}
      />

      {/* Enhanced Photo Upload Modal - rendered when modal props are provided */}
      {useEnhancedUpload && (
        <EnhancedPhotoUploadModal
          isOpen={isPhotoModalOpen}
          onClose={onPhotoModalClose!}
          onImageSelect={onModalPhotoSelect!}
          onImageRemove={onPhotoRemove}
          currentImage={null} // Could be enhanced to track current image
          title="Upload Task Image"
          description="Attach an image."
        />
      )}
    </div>
  );
}
