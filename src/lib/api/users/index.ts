/**
 * User Service - Modular API
 * 
 * Split into focused modules for better maintainability:
 * - CRUD operations: Basic create, read, update, delete
 * - Search operations: Filtering, searching, querying
 * - Statistics: Analytics and counts
 * - Validation: Existence checks and validation
 */

// Re-export functions for direct usage
import * as UserCrud from './user-crud';
import * as UserSearch from './user-search';
import * as UserStats from './user-stats';
import * as UserValidation from './user-validation';

// Export all functions from individual modules
export * from './user-crud';
export * from './user-search';
export * from './user-stats';
export * from './user-validation';

// Export shared types and utilities
export * from './shared';

/**
 * Backward compatibility: UserService class
 * 
 * Maintains the same API as the original UserService for existing code.
 */
export class UserService {
  // CRUD Operations
  static getById = UserCrud.getById;
  static getCurrentUser = UserCrud.getCurrentUser;
  static updateProfile = UserCrud.updateProfile;
  static updateCurrentUserProfile = UserCrud.updateCurrentUserProfile;
  static createProfile = UserCrud.createProfile;
  static delete = UserCrud.deleteUser;

  // Search Operations  
  static getAll = UserSearch.getAll;
  static search = UserSearch.search;
  static getByRole = UserSearch.getByRole;

  // Statistics
  static getStats = UserStats.getStats;

  // Validation
  static existsByEmail = UserValidation.existsByEmail;
}

/**
 * Named exports for modular usage
 */
export const Users = {
  // CRUD
  ...UserCrud,
  
  // Search
  ...UserSearch,
  
  // Stats
  ...UserStats,
  
  // Validation
  ...UserValidation,
} as const; 