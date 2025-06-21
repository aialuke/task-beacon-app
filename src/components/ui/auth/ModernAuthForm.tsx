import { Loader2 } from 'lucide-react';
import React, { useActionState, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authAction, type AuthState } from '@/lib/actions/authAction';

import { AuthFormHeader } from './components/AuthFormHeader';

const initialState: AuthState = {
  success: false,
  errors: {},
  data: null,
};

const ModernAuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [state, action, isPending] = useActionState(authAction, initialState);

  // Handle successful authentication
  useEffect(() => {
    if (state.success && state.data) {
      // Navigate to dashboard on successful auth
      navigate('/tasks');
    }
  }, [state.success, state.data, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md rounded-xl border shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8">
          <AuthFormHeader />

          <form action={action} className="space-y-6">
            <input type="hidden" name="mode" value={mode} />
            
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="mt-1"
                />
                {state.errors.name && (
                  <div className="text-red-500 text-sm mt-1">
                    {state.errors.name[0]}
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="mt-1"
              />
              {state.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {state.errors.email[0]}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="mt-1"
              />
              {state.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {state.errors.password[0]}
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="mt-1"
                />
                {state.errors.confirmPassword && (
                  <div className="text-red-500 text-sm mt-1">
                    {state.errors.confirmPassword[0]}
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </Button>

            {state.errors.form && (
              <div className="text-red-500 text-sm text-center">
                {state.errors.form[0]}
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              disabled={isPending}
              className="text-sm"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernAuthForm;
