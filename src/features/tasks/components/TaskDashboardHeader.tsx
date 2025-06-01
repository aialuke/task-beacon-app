import { memo } from "react";

function TaskDashboardHeader() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your tasks and stay organized
          </p>
        </div>
      </div>
    </header>
  );
}

export default memo(TaskDashboardHeader);
