
import { useState, useCallback } from "react";
import { useForm, UseFormProps, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";

interface UseFormWithValidationOptions<T extends FieldValues> extends UseFormProps<T> {
  onSubmit: (data: T) => Promise<void> | void;
  schema: z.ZodType<T>;
  successMessage?: string;
}

// Define a return type that extends UseFormReturn but adds our custom properties
interface UseFormWithValidationReturn<T extends FieldValues> extends UseFormReturn<T> {
  isSubmitting: boolean;
  onSubmit: (data: T) => Promise<void>;
}

export function useFormWithValidation<T extends FieldValues>({
  onSubmit,
  schema,
  successMessage,
  ...formOptions
}: UseFormWithValidationOptions<T>): UseFormWithValidationReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    ...formOptions,
  });

  const handleFormSubmit = useCallback(
    async (data: T) => {
      setIsSubmitting(true);
      try {
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
    [onSubmit, methods, successMessage]
  );

  // Return everything from methods plus our isSubmitting state and onSubmit handler
  return {
    ...methods,
    isSubmitting,
    onSubmit: handleFormSubmit,
  };
}
