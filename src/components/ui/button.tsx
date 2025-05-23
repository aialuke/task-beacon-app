
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/lib/button-variants";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Add direct styles for default variant to ensure button color is applied correctly
    const buttonStyle = variant === "default" ? { 
      backgroundColor: "hsl(221, 77%, 55%)", 
      color: "white",
      borderRadius: "0.75rem",
      WebkitBorderRadius: "0.75rem",
      MozBorderRadius: "0.75rem"
    } : {};
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-variant={variant}
        style={{
          ...buttonStyle,
          ...props.style
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
