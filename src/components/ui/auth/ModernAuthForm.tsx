import React, { useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { AuthFormFields } from './components/AuthFormFields';
import { AuthFormHeader } from './components/AuthFormHeader';
import { AuthModeToggle } from './components/AuthModeToggle';
import { AuthSubmitButton } from './components/AuthSubmitButton';
import { useAuthFormState } from './hooks/useAuthFormState';

const ModernAuthForm: React.FC = () => {
  const {
    mode,
    email,
    password,
    name,
    showPassword,
    loading,
    errors,
    nameInputRef,
    emailInputRef,
    setShowPassword,
    toggleMode,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    handleNameChange,
  } = useAuthFormState();

  useEffect(() => {
    const focusFirstInput = () => {
      if (mode === 'signup' && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    };
    const timer = setTimeout(focusFirstInput, 100);
    return () => { clearTimeout(timer); };
  }, [mode, nameInputRef, emailInputRef]);

  const handleTogglePassword = () => { setShowPassword(!showPassword); };

  return (
    <div className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md rounded-xl border shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8">
          <AuthFormHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthFormFields
              mode={mode}
              name={name}
              email={email}
              password={password}
              showPassword={showPassword}
              errors={errors}
              loading={loading}
              onNameChange={handleNameChange}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onTogglePassword={handleTogglePassword}
              nameInputRef={nameInputRef}
              emailInputRef={emailInputRef}
            />

            <AuthSubmitButton mode={mode} loading={loading} />
          </form>

          <AuthModeToggle mode={mode} loading={loading} onToggle={toggleMode} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernAuthForm;
