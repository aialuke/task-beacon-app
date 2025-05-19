// src/pages/TaskDetails.tsx
import { useParams } from "react-router-dom";

const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1>Task Details for ID: {id}</h1>
      {/* TODO: Implement task details rendering, e.g., fetch task by ID */}
    </div>
  );
};

export default TaskDetailsPage;