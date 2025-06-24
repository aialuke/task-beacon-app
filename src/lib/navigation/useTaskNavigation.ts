/**
 * Task Navigation Hook
 *
 * Centralized navigation logic for task-related routes.
 * Eliminates direct page imports from feature components and
 * provides consistent navigation patterns throughout the app.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TaskNavigationHook {
  /**
   * Navigate to task details page
   */
  goToTaskDetails: (taskId: string) => void;

  /**
   * Navigate to create task page
   */
  goToCreateTask: () => void;

  /**
   * Navigate to follow-up task creation for a parent task
   */
  goToCreateFollowUpTask: (parentTaskId: string) => void;

  /**
   * Navigate back in browser history
   */
  goBack: () => void;

  /**
   * Navigate to task list/dashboard
   */
  goToTaskList: () => void;

  /**
   * Navigate to auth page
   */
  goToAuth: () => void;
}

/**
 * Hook providing centralized task navigation functions
 *
 * @example
 * ```tsx
 * function TaskCard({ task }) {
 *   const { goToTaskDetails } = useTaskNavigation();
 *
 *   return (
 *     <button onClick={() => goToTaskDetails(task.id)}>
 *       View Details
 *     </button>
 *   );
 * }
 * ```
 */
export function useTaskNavigation(): TaskNavigationHook {
  const navigate = useNavigate();

  const goToTaskDetails = useCallback(
    (taskId: string) => {
      navigate(`/tasks/${taskId}`);
    },
    [navigate],
  );

  const goToCreateTask = useCallback(() => {
    navigate('/create-task');
  }, [navigate]);

  const goToCreateFollowUpTask = useCallback(
    (parentTaskId: string) => {
      navigate(`/follow-up-task/${parentTaskId}`);
    },
    [navigate],
  );

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goToTaskList = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const goToAuth = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    goToTaskDetails,
    goToCreateTask,
    goToCreateFollowUpTask,
    goBack,
    goToTaskList,
    goToAuth,
  };
}
