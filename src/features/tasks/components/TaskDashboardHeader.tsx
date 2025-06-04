

import { memo } from "react";

function TaskDashboardHeader() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/hourglass_logo.svg" 
            alt="Task Flow Logo" 
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
          <h1 className="text-xl font-semibold tracking-wide text-foreground sm:text-2xl">
            Task Flow
          </h1>
        </div>
      </div>
    </header>
  );
}

export default memo(TaskDashboardHeader);

