
import { memo } from "react";

function TaskDashboardHeader() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/hourglass_logo.svg" 
            alt="Task Flow Logo" 
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Task Flow
          </h1>
        </div>
      </div>
    </header>
  );
}

export default memo(TaskDashboardHeader);
