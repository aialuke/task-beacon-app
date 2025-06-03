import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Focused hook for task-related navigation
 * 
 * Centralizes navigation logic to keep it separate from business logic
 */
export function useTaskNavigation() {
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