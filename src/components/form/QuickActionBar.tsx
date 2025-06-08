import { useState } from 'react';
import { User, ImageUp, Link, FileCheck } from 'lucide-react';
import { DatePickerButton } from './components/DatePickerButton';
import { ActionButton } from './components/ActionButton';
import { SubmitButton } from './components/SubmitButton';
import { UrlInputModal } from './UrlInputModal';
import { UserSearchModal } from './UserSearchModal';
import { SimplePhotoUploadModal } from './SimplePhotoUploadModal';
import type { ProcessingResult } from '@/lib/utils/image/types';

interface QuickActionBarProps {
  // Date picker props
  dueDate: string;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // User assignment props
  assigneeId: string;
  onAssigneeChange: (value: string) => void;

  // Photo upload props - unified interface
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photoPreview: string | null;
  onPhotoRemove?: () => void;
  photoLoading?: boolean;
  processingResult?: ProcessingResult | null;

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
  onPhotoRemove,
  photoLoading = false,
  processingResult,
  url,
  onUrlChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Share Task',
  disabled = false,
}: QuickActionBarProps) {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const hasUrl = !!url;
  const hasPhoto = !!photoPreview;
  const hasAssignee = !!assigneeId;

  const handlePhotoClick = () => {
    setIsPhotoModalOpen(true);
  };

  const handlePhotoSubmit = () => {
    // Photo is already processed and set via onPhotoChange
    // This just confirms the attachment by closing the modal
    setIsPhotoModalOpen(false);
  };

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
          onClick={() => { setIsUserModalOpen(true); }}
        />

        {/* Photo Button */}
        <ActionButton
          icon={ImageUp}
          label={hasPhoto ? 'Photo Added' : 'Attach'}
          active={hasPhoto}
          disabled={disabled || photoLoading}
          onClick={handlePhotoClick}
        />

        {/* URL Button */}
        <ActionButton
          icon={hasUrl ? FileCheck : Link}
          label={hasUrl ? 'Link Added' : 'Link'}
          active={hasUrl}
          disabled={disabled}
          onClick={() => { setIsUrlModalOpen(true); }}
        />
      </div>

      {/* Submit Button */}
      <SubmitButton
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        disabled={disabled}
      />

      {/* Modals */}
      <UrlInputModal
        isOpen={isUrlModalOpen}
        onClose={() => { setIsUrlModalOpen(false); }}
        value={url}
        onChange={onUrlChange}
      />

      <UserSearchModal
        isOpen={isUserModalOpen}
        onClose={() => { setIsUserModalOpen(false); }}
        value={assigneeId}
        onChange={onAssigneeChange}
      />

      {/* Simple Photo Upload Modal */}
      <SimplePhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => { setIsPhotoModalOpen(false); }}
        photoPreview={photoPreview}
        onPhotoChange={onPhotoChange}
        onPhotoRemove={onPhotoRemove}
        onSubmit={handlePhotoSubmit}
        processingResult={processingResult}
        loading={photoLoading}
        title="Upload Task Image"
      />
    </div>
  );
}
// CodeRabbit review
// CodeRabbit review
