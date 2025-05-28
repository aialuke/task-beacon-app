import React from 'react';
import AuthLayout from '@/styles/components/layout/AuthLayout';
import ModernAuthForm from '@/components/auth/ModernAuthForm';

const AuthPage: React.FC = () => (
  <AuthLayout>
    <ModernAuthForm />
  </AuthLayout>
);

export default AuthPage;