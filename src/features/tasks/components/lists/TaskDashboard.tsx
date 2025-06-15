// === EXTERNAL LIBRARIES ===
import React from 'react';

// === COMPONENTS ===
import TaskDashboardHeader from '@/components/layout/TaskDashboardHeader';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';

import { FabButton } from '../actions';
import TaskFilterNavbar from '../TaskFilterNavbar';

import TaskList from './TaskList';

// === HOOKS ===

export default function TaskDashboard() {
  const { filter, setFilter } = useTaskUIContext();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <TaskDashboardHeader />

        <main className="relative space-y-6">
          {/* Filter Navigation - Now at dashboard level */}
          <div className="w-full">
            <TaskFilterNavbar filter={filter} onFilterChange={setFilter} />
          </div>

          {/* Task Content */}
          <TaskList />
        </main>

        <FabButton />
      </div>
    </div>
  );
}
