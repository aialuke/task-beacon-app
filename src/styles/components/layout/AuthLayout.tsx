import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="form-page-bg">
    <div className="form-container">
      {children}
    </div>
  </div>
);

export default AuthLayout;