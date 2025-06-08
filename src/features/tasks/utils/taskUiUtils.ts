import { Task, TaskStatus } from "@/types";
import { getDaysRemaining } from "@/lib/utils/shared";

export function getTaskStatus(task: Task): TaskStatus {
  if (task.status === "complete") {
    return "complete";
  }
  if (!task.due_date) {
    return "pending";
  }
  const daysRemaining = getDaysRemaining(task.due_date);
  if (daysRemaining !== null && daysRemaining < 0) {
    return "overdue";
  }
  return "pending";
}

export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "complete":
      return "bg-success";
    case "overdue":
      return "bg-destructive";
    case "pending":
    default:
      return "bg-accent";
  }
}

export function getTimerColor(status: TaskStatus): string {
  switch (status) {
    case "complete":
      return "var(--status-complete)";
    case "overdue":
      return "var(--status-overdue)";
    case "pending":
    default:
      return "var(--status-pending)";
  }
}

export function getTimerGradient(status: TaskStatus): string {
  switch (status) {
    case "complete":
      return "url(#gradientComplete)";
    case "overdue":
      return "url(#gradientOverdue)";
    case "pending":
    default:
      return "url(#gradientPending)";
  }
}

export function getStatusTooltipClass(status: TaskStatus): string {
  if (status === "overdue") return "bg-destructive text-destructive-foreground";
  if (status === "complete") return "bg-success text-success-foreground";
  return "bg-popover text-popover-foreground border border-border";
}

export function getTooltipArrowClass(status: TaskStatus): string {
  if (status === "overdue") return "fill-destructive";
  if (status === "complete") return "fill-success";
  return "fill-popover";
}
// CodeRabbit review
