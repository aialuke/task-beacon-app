
/**
 * Database Types - Shared Infrastructure
 * 
 * Core database operation types and interfaces.
 */

// Import from unified type system instead of deleted common.types
import type { ID, Timestamp } from '../utility.types';

// Core database operation interfaces
export interface DatabaseOperation<T = unknown> {
  id: string;
  operation: 'create' | 'read' | 'update' | 'delete' | 'batch';
  table: string;
  data?: T;
  filters?: Record<string, unknown>;
  timestamp: Timestamp;
  userId?: string;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

export interface TableRow {
  id: ID;
  created_at: Timestamp;
  updated_at: Timestamp;
  [key: string]: unknown;
}

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'not_in';
  value: unknown;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  }[];
  limit?: number;
  offset?: number;
  select?: string[];
  include?: string[];
}

// Transaction and batch operation types
export interface TransactionOptions {
  isolationLevel?: 'read_uncommitted' | 'read_committed' | 'repeatable_read' | 'serializable';
  timeout?: number;
  retryAttempts?: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
}

// Schema and migration types
export interface ColumnDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'uuid' | 'text';
  nullable?: boolean;
  defaultValue?: unknown;
  primaryKey?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
  unique?: boolean;
  index?: boolean;
}

export interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
  indexes?: {
    name: string;
    columns: string[];
    unique?: boolean;
  }[];
  constraints?: {
    name: string;
    type: 'check' | 'foreign_key' | 'unique';
    definition: string;
  }[];
}

export interface Migration {
  id: string;
  name: string;
  version: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  appliedAt?: Timestamp;
}

// Monitoring and health types
export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  connectionPool: {
    active: number;
    idle: number;
    total: number;
  };
  responseTime: number;
  lastCheck: Timestamp;
  errors?: string[];
}

export interface AuditLog {
  id: string;
  operation: DatabaseOperation;
  userId?: string;
  timestamp: Timestamp;
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
}

export interface DatabaseError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  query?: string;
  parameters?: unknown[];
  timestamp: Timestamp;
}

// Performance and analytics
export interface QueryMetrics {
  queryId: string;
  sql: string;
  executionTime: number;
  rowsAffected: number;
  timestamp: Timestamp;
  userId?: string;
  cached?: boolean;
}

export interface BackupConfig {
  schedule: string; // Cron expression
  retention: number; // Days to keep backups
  compression: boolean;
  encryption?: boolean;
  destination: string;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: Timestamp;
  status: 'pending' | 'completed' | 'failed';
  checksum?: string;
}
// CodeRabbit review
