import { memo } from 'react';

interface AuthModeToggleProps {
  mode: 'signin' | 'signup';
  loading: boolean;
  onToggle: () => void;
}

export const AuthModeToggle = memo(function AuthModeToggle({
  mode,
  loading,
  onToggle,
}: AuthModeToggleProps) {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-muted-foreground">
        {mode === 'signin'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium text-primary transition-colors hover:text-primary/80 focus:underline focus:outline-none"
          disabled={loading}
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
});
