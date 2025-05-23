
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "button",
  {
    variants: {
      variant: {
        default: "button--primary",
        secondary: "button--secondary",
        outline: "button--outline",
        destructive: "button--destructive",
        ghost: "button--ghost",
        link: "button--link",
        brand: "button--primary",
        "brand-secondary": "button--secondary",
      },
      size: {
        default: "button--md",
        sm: "button--sm",
        lg: "button--lg",
        icon: "button--icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
