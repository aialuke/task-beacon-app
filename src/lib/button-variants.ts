
// src/lib/button-variants.ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:transform hover:translate-y-[-1px] hover:shadow-lg active:translate-y-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/20 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full shadow",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/20 dark:bg-red-500 dark:hover:bg-red-600 rounded-full shadow",
        outline:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 hover:shadow-gray-300/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 rounded-full shadow",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-gray-400/20 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 rounded-full shadow",
        ghost: "hover:bg-gray-100 hover:text-gray-900 hover:shadow-md dark:hover:bg-gray-700 dark:hover:text-gray-100 rounded-full",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        brand: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 rounded-full shadow",
        "brand-secondary": "bg-gray-100 text-blue-600 hover:bg-gray-200 hover:shadow-blue-500/20 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600 rounded-full shadow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-full px-3 py-1",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
