/**
 * Task Forms - Focused Barrel Export
 *
 * Main task form components with lazy loading
 */

import { lazy } from 'react';

// === MAIN FORMS ===
export const CreateTaskForm = lazy(() => import('./CreateTaskForm'));
export const FollowUpTaskForm = lazy(() => import('./FollowUpTaskForm'));
