
/**
 * User Validation Schemas - Phase 1 Implementation
 * 
 * Zod schemas for user-related validation including authentication and profiles.
 */

import { z } from 'zod';
import { emailSchema, passwordSchema, userNameSchema } from './validation';

// === USER AUTHENTICATION SCHEMAS ===

/**
 * Sign in form validation schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Sign up form validation schema
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
  name: userNameSchema.optional(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

/**
 * Password reset request schema
 */
export const passwordResetSchema = z.object({
  email: emailSchema,
});

/**
 * Password change schema
 */
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  }
);

// === USER PROFILE SCHEMAS ===

/**
 * Profile update validation schema
 */
export const profileUpdateSchema = z.object({
  name: userNameSchema,
  email: emailSchema,
  avatar_url: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

/**
 * Profile creation schema (for new users)
 */
export const profileCreateSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  name: userNameSchema,
  email: emailSchema,
  avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
});

// === TYPE EXPORTS ===

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;

// === VALIDATION UTILITIES ===

/**
 * Validates sign in form data
 */
export function validateSignIn(data: unknown) {
  return signInSchema.safeParse(data);
}

/**
 * Validates sign up form data
 */
export function validateSignUp(data: unknown) {
  return signUpSchema.safeParse(data);
}

/**
 * Validates profile update data
 */
export function validateProfileUpdate(data: unknown) {
  return profileUpdateSchema.safeParse(data);
}
