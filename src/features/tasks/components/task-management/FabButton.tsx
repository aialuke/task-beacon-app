import { ClockPlus } from 'lucide-react';

import { useTaskNavigation } from '@/lib/navigation';

export function FabButton() {
  const { goToCreateTask } = useTaskNavigation();

  return (
    <button
      className="fixed bottom-7 right-7 z-[9999] flex size-[52px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:bg-primary/90 active:scale-95 sm:bottom-6 sm:right-6"
      onClick={() => {
        goToCreateTask();
      }}
      aria-label="Create new task"
    >
      <ClockPlus
        size={25}
        strokeWidth={2.5}
        className="text-primary-foreground"
      />
    </button>
  );
}
