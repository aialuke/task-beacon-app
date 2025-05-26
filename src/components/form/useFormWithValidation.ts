
import { useState, useCallback } from "react";
import { useForm, UseFormProps, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { useValidation } from "@/hooks/useValidation";

interface UseFormWithValidationOptions<T extends FieldValues> extends UseFormProps<T> {
  onSubmit: (data: T) => Promise<void> | void;
  schema: z.ZodType<T>;
  successMessage?: string;
  validateOnChange?: boolean;
}

interface UseFormWithValidationReturn<T extends FieldValues> extends UseFormReturn<T> {
  isSubmitting: boolean;
  onSubmit: (data: T) => Promise<void>;
  validateForm: (data: T) => boolean;
}

export function useFormWithValidation<T extends FieldValues>({
  onSubmit,
  schema,
  successMessage,
  validateOnChange = false,
  ...formOptions
}: UseFormWithValidationOptions<T>): UseFormWithValidationReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validate } = useValidation();
  
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    mode: validateOnChange ? 'onChange' : 'onSubmit',
    ...formOptions,
  });

  /**
   * Validate form data manually
   */
  const validateForm = useCallback((data: T): boolean => {
    const result = validate(schema, data);
    
    if (!result.isValid && result.firstError) {
      toast.error(result.firstError);
    }
    
    return result.isValid;
  }, [schema, validate]);

  /**
   * Handle form submission with validation
   */
  const handleFormSubmit = useCallback(
    async (data: T) => {
      setIsSubmitting(true);
      try {
        // Additional validation before submission
        if (!validateForm(data)) {
          return;
        }

        await onSubmit(data);
        
        if (successMessage) {
          toast.success(successMessage);
        }
        methods.reset();
      } catch (error) {
        console.error("Form submission error:", error);
        
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, methods, successMessage, validateForm]
  );

  return {
    ...methods,
    isSubmitting,
    onSubmit: handleFormSubmit,
    validateForm,
  };
}
