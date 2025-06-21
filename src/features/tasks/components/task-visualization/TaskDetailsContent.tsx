import { Calendar1, ExternalLink } from 'lucide-react';
import { memo } from 'react';

import { useTaskNavigation } from '@/lib/navigation';
import { formatDate } from '@/lib/utils/date';
import type { TaskDetailsContentProps } from '@/types';

import { getTaskStatus } from '../../utils/taskUiUtils';
import { ParentTaskReference } from '../task-forms/ParentTaskReference';
import TaskActions from '../task-management/TaskActions';

import { TaskImageGallery } from './TaskImageGallery';

function TaskDetailsContent({
  task,
  isExpanded = false,
}: TaskDetailsContentProps) {
  const { goToTaskDetails } = useTaskNavigation();

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
            goToTaskDetails(task.id);
          }}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}

export default memo(TaskDetailsContent);
