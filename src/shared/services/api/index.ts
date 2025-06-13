/**
 * API Services - Centralized Service Layer
 *
 * Provides clean abstractions for all API services with unified error handling
 */

// Core API services
export { AuthService } from './AuthService';
export { TaskService } from './tasks.service';
export { UserService } from './users.service';

// Utilities and error handling
export * from './error-handling';
export * from './standardized-api';

// Service layer abstractions
// TODO: Create when implementing real-time features
// export { RealtimeService } from './realtime';

// === SERVICE METADATA ===
export const SERVICE_NAME = 'api';
export const SERVICE_VERSION = '1.0.0';
