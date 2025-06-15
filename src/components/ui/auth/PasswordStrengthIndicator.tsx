import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, show }) => {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500',
  ];

  if (!show || password.length === 0) return null;

  return (
    <div className="animate-fade-in mt-3 space-y-2">
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i < strength ? strengthColors[strength - 1] : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          'text-xs transition-colors duration-300',
          strength < 3 ? 'text-destructive' : 'text-success'
        )}
      >
        Password strength: {strengthLabels[strength - 1] || 'Very Weak'}
      </p>
    </div>
  );
};
