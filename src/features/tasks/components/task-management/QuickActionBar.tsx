import { User, ImageUp, Link as LinkIcon, FileCheck } from 'lucide-react';
import { useState, useCallback, type ChangeEvent, type FormEvent } from 'react';

import { ActionButton } from '@/components/form/components/ActionButton';
import { DatePickerButton } from '@/components/form/components/DatePickerButton';
import { SubmitButton } from '@/components/form/components/SubmitButton';
import SimplePhotoUploadModal from '@/components/form/SimplePhotoUploadModal';
import { UrlInputModal } from '@/components/form/UrlInputModal';
import type { ProcessingResult } from '@/lib/utils/image/';

import { UserSearchModal } from '../task-forms/UserSearchModal';

interface QuickActionBarProps {
  // Date picker props
  dueDate: string;
  onDueDateChange: (e: ChangeEvent<HTMLInputElement>) => void;

  // User assignment props
  assigneeId: string;
  onAssigneeChange: (value: string) => void;

  // Photo upload props - unified interface
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  photoPreview: string | null;
  onPhotoRemove?: () => void;
  photoLoading?: boolean;
  processingResult?: ProcessingResult | null;

  // URL props
  url: string;
  onUrlChange: (value: string) => void;

  // Submit props
  onSubmit?: (e: FormEvent) => void;
  isSubmitting?: boolean;

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
  disabled = false,
}: QuickActionBarProps) {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const hasUrl = !!url;
  const hasPhoto = !!photoPreview;
  const hasAssignee = !!assigneeId;

  const handlePhotoClick = useCallback(() => {
    setIsPhotoModalOpen(true);
  }, []);

  const handlePhotoSubmit = useCallback(() => {
    // Photo is already processed and set via onPhotoChange
    // This just confirms the attachment by closing the modal
    setIsPhotoModalOpen(false);
  }, []);

  const handleUrlModalClose = useCallback(() => {
    setIsUrlModalOpen(false);
  }, []);

  const handleUserModalClose = useCallback(() => {
    setIsUserModalOpen(false);
  }, []);

  const handlePhotoModalClose = useCallback(() => {
    setIsPhotoModalOpen(false);
  }, []);

  const handleUserModalOpen = useCallback(() => {
    setIsUserModalOpen(true);
  }, []);

  const handleUrlModalOpen = useCallback(() => {
    setIsUrlModalOpen(true);
  }, []);

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
          onClick={handleUserModalOpen}
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
          icon={hasUrl ? FileCheck : LinkIcon}
          label={hasUrl ? 'Link Added' : 'Link'}
          active={hasUrl}
          disabled={disabled}
          onClick={handleUrlModalOpen}
        />
      </div>

      {/* Submit Button */}
      <SubmitButton
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        disabled={disabled}
      />

      {/* Modals */}
      <UrlInputModal
        isOpen={isUrlModalOpen}
        onClose={handleUrlModalClose}
        value={url}
        onChange={onUrlChange}
      />

      <UserSearchModal
        isOpen={isUserModalOpen}
        onClose={handleUserModalClose}
        value={assigneeId}
        onChange={onAssigneeChange}
      />

      {/* Simple Photo Upload Modal */}
      <SimplePhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={handlePhotoModalClose}
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
