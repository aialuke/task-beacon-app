import { memo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FloatingInput } from '../FloatingInput';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';

interface AuthFormFieldsProps {
  mode: 'signin' | 'signup';
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  errors: {
    email?: string;
    password?: string;
    name?: string;
  };
  loading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  nameInputRef: React.RefObject<HTMLInputElement>;
  emailInputRef: React.RefObject<HTMLInputElement>;
}

export const AuthFormFields = memo(function AuthFormFields({
  mode,
  name,
  email,
  password,
  showPassword,
  errors,
  loading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  nameInputRef,
  emailInputRef,
}: AuthFormFieldsProps) {
  return (
    <div className="space-y-6">
      {mode === 'signup' && (
        <FloatingInput
          ref={nameInputRef}
          id="name"
          type="text"
          label="Name"
          value={name}
          onChange={onNameChange}
          error={errors.name}
          disabled={loading}
          autoComplete="name"
        />
      )}

      <FloatingInput
        ref={emailInputRef}
        id="email"
        type="email"
        label="Email Address"
        value={email}
        onChange={onEmailChange}
        error={errors.email}
        disabled={loading}
        autoComplete={mode === 'signin' ? 'username' : 'email'}
      />

      <div className="relative">
        <FloatingInput
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={onPasswordChange}
          error={errors.password}
          disabled={loading}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
          disabled={loading}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {mode === 'signup' && password && (
        <PasswordStrengthIndicator password={password} show={password.length > 0} />
      )}
    </div>
  );
});
// CodeRabbit review
// CodeRabbit review
