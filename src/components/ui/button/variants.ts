import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all hover:-translate-y-px hover:transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md',
        destructive:
          'rounded-full bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 hover:shadow-md',
        outline:
          'rounded-full border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground hover:shadow-md',
        secondary:
          'rounded-full bg-secondary text-secondary-foreground shadow hover:bg-secondary/80 hover:shadow-md',
        ghost: 'rounded-full hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        brand:
          'bg-gradient-primary hover:bg-gradient-primary-dark rounded-full text-primary-foreground shadow hover:shadow-md',
        'brand-secondary':
          'rounded-full bg-secondary text-primary shadow hover:bg-secondary/80 hover:shadow-md',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-full px-3 py-1',
        lg: 'h-11 rounded-full px-8',
        icon: 'size-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
