import { memo } from 'react';

import { Button } from '@/components/ui/button';

interface TaskExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

function TaskExpandButton({ isExpanded, onClick }: TaskExpandButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpanded) onClick(); // Only collapse when expanded
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (isExpanded && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 hover:bg-accent hover:text-accent-foreground"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={isExpanded ? 'Collapse task details' : 'Expand task details'}
      tabIndex={0}
      aria-expanded={isExpanded}
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
