/**
 * Task Details Page - Phase 2 Refactored
 * 
 * Simplified page component that delegates to the container component.
 * Follows Container-Presentation pattern.
 */

import { TaskDetailsContainer } from "@/features/tasks/containers/TaskDetailsContainer";

const TaskDetailsPage = () => {
  return <TaskDetailsContainer />;
};

export default TaskDetailsPage;
