import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useProfileValidation } from './useProfileValidation';

describe('useProfileValidation', () => {
  it('validates a valid profile', () => {
    const { result } = renderHook(() => useProfileValidation());
    const validProfile = { email: 'test@example.com', name: 'Test User' };
    const validation = result.current.validateProfile(validProfile);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });

  it('invalidates a profile with invalid email', () => {
    const { result } = renderHook(() => useProfileValidation());
    const invalidProfile = { email: 'invalid', name: 'Test User' };
    const validation = result.current.validateProfile(invalidProfile);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
}); // CodeRabbit review
// CodeRabbit review
