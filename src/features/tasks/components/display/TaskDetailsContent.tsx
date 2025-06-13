import { Calendar1, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ParentTaskReference } from '@/components/form/ParentTaskReference';
import { formatDate } from '@/shared/utils/date';
import type { Task } from '@/types';

import TaskActions from '../actions/TaskActions';

import { TaskImageGallery } from './TaskImageGallery';

interface TaskDetailsContentProps {
  task: Task;
  isExpanded?: boolean;
}

export default function TaskDetailsContent({
  task,
  isExpanded = false,
}: TaskDetailsContentProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Task Description */}
      {task.description && (
        <div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
      )}

      {/* Image Gallery */}
      <TaskImageGallery task={task} />

      {/* Date + URL Info (Combined Section) */}
      {(task.due_date || task.url_link) && (
        <div className="space-y-3">
          {task.due_date && (
            <div className="flex items-center gap-3">
              <Calendar1 className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDate(task.due_date)}
              </span>
            </div>
          )}

          {task.url_link && (
            <div className="flex items-center gap-2">
              <ExternalLink className="size-4 text-primary" />
              <a
                href={task.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {task.url_link}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Parent Task Reference */}
      {task.parent_task && (
        <div>
          <ParentTaskReference parentTask={task.parent_task} />
        </div>
      )}

      {/* Single Border Separator + Action Buttons */}
      <div className="border-t pt-4">
        <TaskActions
          task={task}
          onView={() => {
            navigate(`/tasks/${task.id}`);
          }}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}
