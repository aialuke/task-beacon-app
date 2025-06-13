/**
 * Task Components - Focused Barrel Export
 *
 * Organized by category with lazy loading for code splitting
 */

import { lazy } from 'react';

// === LISTS ===
export const TaskList = lazy(() => import('./lists/TaskList'));
export const TaskDashboard = lazy(() => import('./lists/TaskDashboard'));

// === CARDS ===
export const TaskCard = lazy(() => import('./cards/TaskCard'));

// === FORMS ===
export const UnifiedTaskForm = lazy(() =>
  import('./forms/UnifiedTaskForm').then(module => ({
    default: module.UnifiedTaskForm,
  }))
);
export const QuickActionBar = lazy(() =>
  import('./forms/QuickActionBar').then(module => ({
    default: module.QuickActionBar,
  }))
);

// === DISPLAY ===
export const TaskDetails = lazy(() => import('./display/TaskDetails'));
export const TaskDetailsContent = lazy(
  () => import('./display/TaskDetailsContent')
);
export const TaskHeader = lazy(() => import('./display/TaskHeader'));
export const TaskImageGallery = lazy(() =>
  import('./display/TaskImageGallery').then(module => ({
    default: module.TaskImageGallery,
  }))
);
export const TaskStatus = lazy(() => import('./display/TaskStatus'));

// === TIMER ===
export const CountdownTimer = lazy(() => import('./CountdownTimer'));
export const TimerDisplay = lazy(() => import('./timer/TimerDisplay'));
export const TimerRing = lazy(() => import('./timer/TimerRing'));

// === UI CONTROLS ===
export const TaskExpandButton = lazy(() => import('./TaskExpandButton'));
export const TaskFilterNavbar = lazy(() => import('./TaskFilterNavbar'));
export const TaskPagination = lazy(() => import('./TaskPagination'));

// === MODALS ===
export const ImagePreviewModal = lazy(() =>
  import('./ImagePreviewModal').then(module => ({
    default: module.ImagePreviewModal,
  }))
);

// === ACTIONS ===
export * from './actions';
