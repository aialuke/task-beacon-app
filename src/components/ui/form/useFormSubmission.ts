import { useCallback, useState } from 'react';

interface UseFormSubmissionOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  successMessage?: string;
  reset: () => void;
}

export function useFormSubmission<T>({ onSubmit, successMessage = 'Success', reset }: UseFormSubmissionOptions<T>) {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: T) => {
      setFormError(null);
      setFormSuccess(null);
      try {
        await onSubmit(data);
        setFormSuccess(successMessage);
        reset();
      } catch (error) {
        if (error instanceof Error) {
          setFormError(error.message);
        } else {
          setFormError('An unexpected error occurred');
        }
      }
    },
    [onSubmit, successMessage, reset]
  );

  return {
    handleSubmit,
    formError,
    formSuccess,
  };
} 