
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Standardized hook for task-related navigation
 * 
 * Follows naming pattern: use[Feature][Entity][Action]
 * Feature: Tasks, Entity: -, Action: Navigate
 */
export function useTasksNavigate() {
  const navigate = useNavigate();

  const navigateToDashboard = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const navigateToTask = useCallback((taskId: string) => {
    navigate(`/tasks/${taskId}`);
  }, [navigate]);

  const navigateToEditTask = useCallback((taskId: string) => {
    navigate(`/tasks/${taskId}/edit`);
  }, [navigate]);

  const navigateToCreateTask = useCallback(() => {
    navigate('/tasks/new');
  }, [navigate]);

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    navigateToDashboard,
    navigateToTask,
    navigateToEditTask,
    navigateToCreateTask,
    navigateBack,
  };
}
