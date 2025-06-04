
import React from 'react';
import { FloatingInput } from '@/components/ui/form/FloatingInput';
import { FloatingTextarea } from '@/components/ui/form/FloatingTextarea';
import { QuickActionBar } from './QuickActionBar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/layout/LoadingSpinner';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import type { ProcessingResult } from '@/lib/utils/image/types';

interface BaseTaskFormProps {
  // Form fields
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;

  // Photo upload
  photoPreview: string | null;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: () => void;

  // Enhanced photo upload
  isPhotoModalOpen?: boolean;
  onPhotoModalOpen?: () => void;
  onPhotoModalClose?: () => void;
  onModalPhotoSelect?: (file: File, processedResult?: ProcessingResult) => void;
  uploadProgress?: number;
  photoError?: string | null;

  // Form submission
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;

  // UI customization
  headerTitle: string;
  headerSubtitle: string;
  submitLabel: string;
  
  // Optional placeholders and labels
  titlePlaceholder?: string;
  titleLabel?: string;
  descriptionPlaceholder?: string;
  
  // Children support
  children?: React.ReactNode;
}

export function BaseTaskForm({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  url,
  setUrl,
  assigneeId,
  setAssigneeId,
  photoPreview,
  handlePhotoChange,
  onPhotoRemove,
  isPhotoModalOpen,
  onPhotoModalOpen,
  onPhotoModalClose,
  onModalPhotoSelect,
  uploadProgress = 0,
  photoError,
  handleSubmit,
  loading,
  headerTitle,
  headerSubtitle,
  submitLabel,
  titlePlaceholder,
  titleLabel = "Task Title",
  descriptionPlaceholder,
  children,
}: BaseTaskFormProps) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{headerTitle}</h1>
          <p className="text-sm text-gray-600">{headerSubtitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <FloatingInput
              id="title"
              label={titleLabel}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />

            {/* Description Input */}
            <FloatingTextarea
              id="description"
              label="Description (optional)"
              placeholder={descriptionPlaceholder || "Description (optional)"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />

            {/* Photo Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uploading photo...</span>
                  <span className="text-gray-600">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Photo Error Display */}
            {photoError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-sm">{photoError}</span>
              </div>
            )}

            {/* Quick Action Bar */}
            <QuickActionBar
              dueDate={dueDate}
              onDueDateChange={(e) => setDueDate(e.target.value)}
              assigneeId={assigneeId}
              onAssigneeChange={setAssigneeId}
              onPhotoChange={handlePhotoChange}
              photoPreview={photoPreview}
              isPhotoModalOpen={isPhotoModalOpen}
              onPhotoModalOpen={onPhotoModalOpen}
              onPhotoModalClose={onPhotoModalClose}
              onModalPhotoSelect={onModalPhotoSelect}
              onPhotoRemove={onPhotoRemove}
              url={url}
              onUrlChange={setUrl}
              onSubmit={handleSubmit}
              isSubmitting={loading}
              submitLabel={submitLabel}
              disabled={loading}
            />
          </form>

          {/* Children content */}
          {children}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
