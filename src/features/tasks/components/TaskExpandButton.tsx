import { memo } from 'react';

import { Button } from '@/shared/components/ui/button';

interface TaskExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

function TaskExpandButton({ isExpanded, onClick }: TaskExpandButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 hover:bg-accent hover:text-accent-foreground"
      onClick={onClick}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`transform text-foreground transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`}
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}

export default memo(TaskExpandButton);
