
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveFieldContainerProps {
  isVisible: boolean;
  children: ReactNode;
  className?: string;
}

export function ProgressiveFieldContainer({ 
  isVisible, 
  children, 
  className 
}: ProgressiveFieldContainerProps) {
  return (
    <div className={cn(
      "transition-all duration-500 ease-in-out overflow-hidden",
      isVisible 
        ? "max-h-96 opacity-100 transform translate-y-0" 
        : "max-h-0 opacity-0 transform -translate-y-2",
      className
    )}>
      <div className={cn(
        "transition-all duration-300",
        isVisible ? "pt-4" : "pt-0"
      )}>
        {children}
      </div>
    </div>
  );
}
