
import { memo } from 'react';

interface AuthFormHeaderProps {
  mode: 'signin' | 'signup';
}

export const AuthFormHeader = memo(function AuthFormHeader({ mode }: AuthFormHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-2 text-3xl font-regular tracking-tight text-foreground">
        {mode === 'signin' ? 'Sign In' : 'Create an account'}
      </h1>
    </div>
  );
});
