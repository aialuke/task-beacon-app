import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/shared/components/ui/button';

interface AuthSubmitButtonProps {
  mode: 'signin' | 'signup';
  loading: boolean;
}

export const AuthSubmitButton = memo(function AuthSubmitButton({
  mode,
  loading,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500"
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="size-4 animate-spin" />
          <span>
            {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
          </span>
        </div>
      ) : (
        <span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span>
      )}
    </Button>
  );
});
