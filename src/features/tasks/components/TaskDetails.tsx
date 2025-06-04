
import { memo, useState } from 'react';
import { Task } from '@/types';
import { animated, SpringValue } from '@react-spring/web';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';
import TaskActions from './TaskActions';
import TaskMetadata from './TaskMetadata';
import ParentTaskInfo from './ParentTaskInfo';

interface TaskDetailsProps {
  task: Task;
  isExpanded: boolean;
  animationState: {
    height: SpringValue<number>;
    opacity: SpringValue<number>;
  };
  contentRef: React.RefObject<HTMLDivElement>;
}

function TaskDetails({
  task,
  isExpanded,
  animationState,
  contentRef,
}: TaskDetailsProps) {
  const { isMobile } = useTaskUIContext();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Debug logging
  console.log('TaskDetails - Task object:', task);
  console.log('TaskDetails - photo_url:', task.photo_url);
  console.log('TaskDetails - photo_url type:', typeof task.photo_url);
  console.log('TaskDetails - photo_url truthy:', !!task.photo_url);

  const handleImageClick = () => {
    console.log('Image clicked, opening modal');
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    console.log('Closing image modal');
    setIsImageModalOpen(false);
  };

  return (
    <>
      <animated.div
        ref={contentRef}
        style={{
          height: animationState.height,
          opacity: animationState.opacity,
          willChange: 'height, opacity',
          overflowY: 'hidden',
          minHeight: 0,
          zIndex: 2,
          visibility: isExpanded ? 'visible' : 'hidden',
        }}
        className="mt-1 w-full"
      >
        <div
          className={`space-y-3 ${isMobile ? 'pb-4 pl-4 pt-2' : 'pb-4 pl-6 pt-2'}`}
          style={{ height: isExpanded ? 'auto' : '0', overflowY: 'hidden' }}
        >
          {task.description && (
            <div className="text-sm text-muted-foreground">
              {task.description}
            </div>
          )}

          <TaskMetadata dueDate={task.due_date} url={task.url_link} />

          {task.parent_task && task.parent_task_id && (
            <ParentTaskInfo
              parentTask={task.parent_task}
              parentTaskId={task.parent_task_id}
            />
          )}

          {/* Debug the photo_url rendering */}
          {console.log('Rendering photo section, photo_url exists:', !!task.photo_url)}
          {task.photo_url && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">
                Photo:
              </span>
              <button
                onClick={handleImageClick}
                className="mt-1 block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-xl"
                title="Click to view full size"
              >
                <img
                  src={task.photo_url}
                  alt="Task attachment"
                  className="h-20 w-20 rounded-xl object-cover cursor-pointer"
                  loading="lazy"
                  onLoad={() => console.log('Image loaded successfully:', task.photo_url)}
                  onError={(e) => console.error('Image failed to load:', task.photo_url, e)}
                />
              </button>
            </div>
          )}

          <TaskActions task={task} />
        </div>
      </animated.div>

      {task.photo_url && (
        <ImagePreviewModal
          isOpen={isImageModalOpen}
          onClose={handleImageModalClose}
          imageUrl={task.photo_url}
          alt="Task attachment"
        />
      )}
    </>
  );
}

export default memo(TaskDetails);
