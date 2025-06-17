import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { AuthFormFields } from './components/AuthFormFields';
import { AuthFormHeader } from './components/AuthFormHeader';
import { AuthModeToggle } from './components/AuthModeToggle';
import { AuthSubmitButton } from './components/AuthSubmitButton';
import { useAuthForm } from './hooks/useAuthForm';

const ModernAuthForm: React.FC = () => {
  const { formState, formHandlers, formRefs } = useAuthForm();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md rounded-xl border shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8">
          <AuthFormHeader />

          <form onSubmit={formHandlers.handleSubmit} className="space-y-6">
            <AuthFormFields
              mode={formState.mode}
              name={formState.name}
              email={formState.email}
              password={formState.password}
              showPassword={formState.showPassword}
              errors={formState.errors}
              loading={formState.isSubmitting}
              onNameChange={formHandlers.handleNameChange}
              onEmailChange={formHandlers.handleEmailChange}
              onPasswordChange={formHandlers.handlePasswordChange}
              onTogglePassword={formHandlers.handleTogglePassword}
              nameInputRef={formRefs.nameInputRef}
              emailInputRef={formRefs.emailInputRef}
            />

            <AuthSubmitButton
              mode={formState.mode}
              loading={formState.isSubmitting}
            />
          </form>

          <AuthModeToggle
            mode={formState.mode}
            loading={formState.isSubmitting}
            onToggle={formHandlers.handleModeSwitch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernAuthForm;
