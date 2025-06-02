/**
 * Shared Database Types
 * 
 * Types for database operations, table interfaces, and query patterns.
 * Used across all database interactions and API services.
 */

import type { BaseEntity } from './common.types';

// Database operation types
export type DatabaseOperation = 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
export type RealTimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// Table row base interface
export interface TableRow extends BaseEntity {
  [key: string]: unknown;
}

// Database query filters
export interface QueryFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is' | 'not';
  value: unknown;
}

export interface QueryOptions {
  select?: string;
  filters?: QueryFilter[];
  orderBy?: {
    column: string;
    ascending?: boolean;
  }[];
  range?: {
    from: number;
    to: number;
  };
  single?: boolean;
}

// Real-time subscription types
export interface RealtimeSubscription {
  table: string;
  event: RealTimeEvent;
  schema?: string;
  filter?: string;
}

export interface RealtimePayload<T = unknown> {
  eventType: RealTimeEvent;
  new: T | null;
  old: T | null;
  errors: unknown[] | null;
}

// Database transaction types
export interface TransactionOptions {
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
  readOnly?: boolean;
  deferrable?: boolean;
}

// Database connection types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
  timeout?: number;
}

// Table schema types
export interface ColumnDefinition {
  name: string;
  type: 'text' | 'integer' | 'boolean' | 'timestamp' | 'uuid' | 'json' | 'array';
  nullable?: boolean;
  default?: unknown;
  primaryKey?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
  unique?: boolean;
  indexed?: boolean;
}

export interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
  constraints?: {
    primaryKey?: string[];
    foreignKeys?: {
      columns: string[];
      references: {
        table: string;
        columns: string[];
      };
    }[];
    unique?: string[][];
    check?: {
      name: string;
      expression: string;
    }[];
  };
}

// Migration types
export interface Migration {
  id: string;
  name: string;
  version: number;
  up: string;
  down: string;
  createdAt: Date;
  appliedAt?: Date;
}

// Database health and monitoring
export interface DatabaseHealth {
  connected: boolean;
  responseTime: number;
  activeConnections: number;
  maxConnections: number;
  version: string;
  lastChecked: Date;
}

// Audit log types
export interface AuditLog extends BaseEntity {
  table_name: string;
  operation: DatabaseOperation;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// Database error types
export interface DatabaseError {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  detail?: string;
  hint?: string;
  position?: number;
  internalPosition?: number;
  internalQuery?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
  file?: string;
  line?: number;
  routine?: string;
}

// Database performance metrics
export interface QueryMetrics {
  queryId: string;
  query: string;
  executionTime: number;
  planningTime: number;
  bufferHits: number;
  bufferMisses: number;
  rowsReturned: number;
  rowsAffected: number;
  timestamp: Date;
}

// Backup and restore types
export interface BackupConfig {
  schedule: string; // cron expression
  retention: number; // days
  compression: boolean;
  encryption: boolean;
  destination: string;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  checksum: string;
  compressed: boolean;
  encrypted: boolean;
} 