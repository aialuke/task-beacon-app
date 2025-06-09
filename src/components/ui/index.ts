
/**
 * UI Components Index - Phase 4 Updated
 * 
 * Consolidated exports with unified loading states.
 */

// === UNIFIED LOADING STATES (All consolidated) ===
export {
  LoadingSpinner,
  CardSkeleton,
  ImageSkeleton,
  PageLoader,
  CardLoader,
  InlineLoader,
} from './loading/UnifiedLoadingStates';

// === CORE UI COMPONENTS ===
export { Button } from './button';
export { Input } from './input';
export { Textarea } from './textarea';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
export { Badge } from './badge';
export { Avatar, AvatarFallback, AvatarImage } from './avatar';
export { Skeleton } from './skeleton';
export { Calendar } from './calendar';
export { Popover, PopoverContent, PopoverTrigger } from './popover';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

// === SPECIALIZED COMPONENTS ===
export { default as SimpleLazyImage } from './SimpleLazyImage';
export { default as UnifiedErrorHandler } from './error/UnifiedErrorHandler';

// === LAZY LOADING ===
export { withLazyLoading, LazyComponents } from './LazyComponent';

// === FORM COMPONENTS ===
export { FloatingInput } from './form/FloatingInput';
export { FloatingTextarea } from './form/FloatingTextarea';
export { AnimatedCharacterCount } from './form/AnimatedCharacterCount';

// === AUTHENTICATION ===
export { default as ModernAuthForm } from './auth/ModernAuthForm';
export { default as PasswordStrengthIndicator } from './auth/PasswordStrengthIndicator';

// === NAVIGATION ===
export { default as SimpleNavbar } from './simple-navbar';

// === PAGINATION ===
export { default as GenericPagination } from './GenericPagination';
