/**
 * Drag and Drop Hook
 * 
 * Handles all drag and drop interactions for the photo upload modal.
 * This hook manages dragging state and event handlers.
 */

import { useState, useRef, useCallback } from 'react';
import type { DragDropOptions } from '../types';

/**
 * Custom hook for managing drag and drop functionality
 */
export function useDragAndDrop(options: DragDropOptions) {
  const { onFileSelect } = options;
  
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file drop event
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  /**
   * Handle drag over event
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  /**
   * Handle drag leave event
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set isDragging to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  /**
   * Handle click to open file dialog
   */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  }, [onFileSelect]);

  return {
    isDragging,
    dropZoneRef,
    fileInputRef,
    dragHandlers: {
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      dropZoneRef,
    },
    onClick: handleClick,
    onFileInputChange: handleFileInputChange,
  };
} 