import { TooltipContent, TooltipArrow } from '@/components/ui/tooltip';
import { TaskStatus } from '@/types/shared.types';
import { getStatusTooltipClass, getTooltipArrowClass } from '@/lib/uiUtils';

interface TimerTooltipProps {
  tooltipContent: string;
  status: TaskStatus;
}

const TimerTooltip = ({ tooltipContent, status }: TimerTooltipProps) => {
  return (
    <TooltipContent
      id="timer-tooltip"
      className={`z-50 rounded-lg px-5 py-3 text-lg shadow-xl ${getStatusTooltipClass(status)}`}
      side="top"
      sideOffset={10}
    >
      <TooltipArrow className={getTooltipArrowClass(status)} />
      {tooltipContent}
    </TooltipContent>
  );
};

export default TimerTooltip;
