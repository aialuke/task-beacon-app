import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface UseFormWithZodOptions<T> {
  schema: z.ZodSchema<T>;
  defaultValues: T;
}

export function useFormWithZod<T>({ schema, defaultValues }: UseFormWithZodOptions<T>) {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as unknown as T,
  });
} 