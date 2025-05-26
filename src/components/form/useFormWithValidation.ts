
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/lib/toast";
import { useCallback } from "react";

interface UseFormWithValidationOptions<T> {
  schema: z.ZodSchema<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<void>;
  successMessage?: string;
}

export function useFormWithValidation<T>({
  schema,
  defaultValues,
  onSubmit,
  successMessage = "Success"
}: UseFormWithValidationOptions<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any, // Type assertion to fix the generic constraint
  });

  const handleSubmit = useCallback(async (data: T) => {
    try {
      await onSubmit(data);
      toast.success(successMessage);
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }, [onSubmit, successMessage, form]);

  return {
    ...form,
    onSubmit: handleSubmit,
    isSubmitting: form.formState.isSubmitting, // Explicitly expose isSubmitting
  };
}
