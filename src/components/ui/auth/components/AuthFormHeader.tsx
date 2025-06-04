import { memo } from 'react';
interface AuthFormHeaderProps {
  mode: 'signin' | 'signup';
}
export const AuthFormHeader = memo(function AuthFormHeader({
  mode
}: AuthFormHeaderProps) {
  return <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <img src="/assets/hourglass_logo.svg" alt="Task Flow Logo" className="h-8 w-8" />
        <h1 className="text-2xl font-semibold tracking-wide text-foreground">
          Task Flow
        </h1>
      </div>
      
    </div>;
});