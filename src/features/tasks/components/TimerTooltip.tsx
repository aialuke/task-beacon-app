import {
  getStatusTooltipClass,
  getTooltipArrowClass,
} from '@/features/tasks/utils/taskUiUtils';
import { TooltipContent, TooltipArrow } from '@/shared/components/ui/tooltip';
import type { TaskStatus } from '@/types';

interface TimerTooltipProps {
  tooltipContent: string;
  status: TaskStatus;
}

const TimerTooltip = ({ tooltipContent, status }: TimerTooltipProps) => {
  return (
    <TooltipContent
      id="timer-tooltip"
      className={`z-50 px-5 py-3 text-lg shadow-xl ${getStatusTooltipClass(
        status
      )}`}
      side="top"
      sideOffset={10}
    >
      <TooltipArrow className={getTooltipArrowClass(status)} />
      {tooltipContent}
    </TooltipContent>
  );
};

export default TimerTooltip;
