
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useProfileValidation } from './useProfileValidation';

describe('useProfileValidation', () => {
  it('validates a valid profile', () => {
    const { result } = renderHook(() => useProfileValidation());
    const validProfile = { 
      email: 'test@example.com', 
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg'
    };
    const validation = result.current.validateProfile(validProfile);
    expect(validation.isValid).toBe(true);
    expect(Object.keys(validation.errors).length).toBe(0);
  });

  it('invalidates a profile with invalid email', () => {
    const { result } = renderHook(() => useProfileValidation());
    const invalidProfile = { 
      email: 'invalid', 
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg'
    };
    const validation = result.current.validateProfile(invalidProfile);
    expect(validation.isValid).toBe(false);
    expect(Object.keys(validation.errors).length).toBeGreaterThan(0);
    expect(validation.errors.email).toBeDefined();
  });

  it('validates individual profile fields', () => {
    const { result } = renderHook(() => useProfileValidation());
    
    // Test valid email
    const emailValidation = result.current.validateProfileField('email', 'test@example.com');
    expect(emailValidation.isValid).toBe(true);
    
    // Test invalid email
    const invalidEmailValidation = result.current.validateProfileField('email', 'invalid');
    expect(invalidEmailValidation.isValid).toBe(false);
    expect(invalidEmailValidation.error).toBeDefined();
    
    // Test valid name
    const nameValidation = result.current.validateProfileField('name', 'Test User');
    expect(nameValidation.isValid).toBe(true);
    
    // Test invalid name (too short)
    const invalidNameValidation = result.current.validateProfileField('name', 'T');
    expect(invalidNameValidation.isValid).toBe(false);
    expect(invalidNameValidation.error).toBeDefined();
  });

  it('validates name field specifically', () => {
    const { result } = renderHook(() => useProfileValidation());
    
    expect(result.current.validateName('Test User')).toBe(true);
    expect(result.current.validateName('T')).toBe(false); // Too short
    expect(result.current.validateName('')).toBe(false); // Empty
  });

  it('validates email field specifically', () => {
    const { result } = renderHook(() => useProfileValidation());
    
    expect(result.current.validateEmail('test@example.com')).toBe(true);
    expect(result.current.validateEmail('invalid')).toBe(false);
    expect(result.current.validateEmail('')).toBe(false);
  });

  it('validates avatar URL field specifically', () => {
    const { result } = renderHook(() => useProfileValidation());
    
    expect(result.current.validateAvatarUrl('https://example.com/avatar.jpg')).toBe(true);
    expect(result.current.validateAvatarUrl('')).toBe(true); // Optional field
    expect(result.current.validateAvatarUrl('invalid-url')).toBe(false);
  });
});
