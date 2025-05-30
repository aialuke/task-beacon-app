import { memo } from 'react';
import { formatDate } from '@/lib/dateUtils';
import { truncateUrl } from '@/lib/formatUtils';
import { Calendar1, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskMetadataProps {
  dueDate: string | null;
  url: string | null;
}

// Custom equality function for TaskMetadata props
const arePropsEqual = (
  prevProps: TaskMetadataProps,
  nextProps: TaskMetadataProps
): boolean => {
  return (
    prevProps.dueDate === nextProps.dueDate && prevProps.url === nextProps.url
  );
};

function TaskMetadata({ dueDate, url }: TaskMetadataProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Calendar1 size={16} className="shrink-0 text-task-overdue" />
        <p className="text-sm text-gray-600">
          {dueDate ? formatDate(dueDate) : 'No due date'}
        </p>
      </div>
      {url && (
        <div className="flex min-w-0 items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex max-w-[180px] items-center gap-2 truncate text-sm text-primary hover:underline sm:max-w-[280px]"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Open ${url} in new tab`}
                >
                  <ExternalLink size={16} className="shrink-0 text-primary" />
                  <span>{truncateUrl(url, 20)}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{url}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

export default memo(TaskMetadata, arePropsEqual);
