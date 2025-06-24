import { Button } from '@/components/ui/button';

interface TaskExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

function TaskExpandButton({ isExpanded, onClick }: TaskExpandButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(); // Allow both expand and collapse
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(); // Allow both expand and collapse
    }
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent active:bg-accent"
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

export default TaskExpandButton;
