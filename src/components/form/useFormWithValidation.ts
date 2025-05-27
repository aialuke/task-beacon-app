import { useState, useCallback } from "react";

interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string | null;
}

export function useFormWithValidation<T extends FormValues>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string): string | null => {
    if (!value) return `${name} is required`;
    return null;
  };

  const handleChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const validateForm = (formData: T): boolean => { // Line 23: Replace 'any' with 'T'
    let isValid = true;
    const newErrors: FormErrors = {};
    for (const [name, value] of Object.entries(formData)) {
      const error = validateField(name, value);
      newErrors[name] = error;
      if (error) isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  return { values, errors, handleChange, validateForm };
}