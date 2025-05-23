
import { memo } from "react";
import { formatDate } from "@/lib/dateUtils";
import { truncateUrl } from "@/lib/formatUtils";
import { Calendar1, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskMetadataProps {
  dueDate: string | null;
  url: string | null;
}

function TaskMetadata({ dueDate, url }: TaskMetadataProps) {
  return (
    <div className="flex items-center flex-wrap gap-4 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <Calendar1 size={16} className="text-task-overdue shrink-0" />
        <p className="text-sm text-gray-600">{dueDate ? formatDate(dueDate) : "No due date"}</p>
      </div>
      {url && (
        <div className="flex items-center gap-2 min-w-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline truncate max-w-[180px] sm:max-w-[280px]"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Open ${url} in new tab`}
                >
                  <ExternalLink size={16} className="text-primary shrink-0" />
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

export default memo(TaskMetadata);
