
import * as React from "react";
import { cn } from "@/lib/utils";
import { useBorderRadius } from "@/contexts/BorderRadiusContext";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  const borderStyles = useBorderRadius();
  
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      style={{
        borderRadius: "0.75rem",
        WebkitBorderRadius: "0.75rem",
        MozBorderRadius: "0.75rem",
        borderWidth: "1px",
        ...props.style
      }}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
