
import {
  TooltipContent,
  TooltipArrow,
} from "@/components/ui/tooltip";
import { TaskStatus } from "@/lib/types";

interface TimerTooltipProps {
  tooltipContent: string;
  status: TaskStatus;
}

const getStatusTooltipClass = (status: TaskStatus): string => {
  if (status === "overdue") return "bg-destructive text-destructive-foreground";
  if (status === "complete") return "bg-success text-success-foreground";
  return "bg-popover text-popover-foreground border border-border";
};

const getTooltipArrowClass = (status: TaskStatus): string => {
  if (status === "overdue") return "fill-destructive";
  if (status === "complete") return "fill-success";
  return "fill-popover";
};

const TimerTooltip = ({ tooltipContent, status }: TimerTooltipProps) => {
  return (
    <TooltipContent
      id="timer-tooltip"
      className={`px-5 py-3 rounded-lg text-lg shadow-xl z-50 ${getStatusTooltipClass(status)}`}
      side="top"
      sideOffset={10}
    >
      <TooltipArrow className={getTooltipArrowClass(status)} />
      {tooltipContent}
    </TooltipContent>
  );
};

export default TimerTooltip;
