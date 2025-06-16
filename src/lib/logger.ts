/**
 * Environment-aware logging utility for the application.
 *
 * Provides structured logging with different levels (debug, info, warn, error)
 * and environment-based filtering. Integrates with error handling and
 * performance monitoring systems.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

interface LoggerConfig {
  /** Minimum log level to output (levels below this are filtered out) */
  level: LogLevel;
  /** Whether to include timestamps in log output */
  timestamps: boolean;
  /** Whether to include context/metadata in logs */
  includeContext: boolean;
  /** Custom prefix for all log messages */
  prefix?: string;
  /** Environment name for context */
  environment: string;
}

class Logger {
  private config: LoggerConfig;
  private readonly LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: this.getDefaultLogLevel(),
      timestamps: true,
      includeContext: true,
      environment: this.getEnvironment(),
      ...config,
    };
  }

  /**
   * Get default log level based on environment
   */
  private getDefaultLogLevel(): LogLevel {
    const env = this.getEnvironment();
    switch (env) {
      case 'production':
        return 'warn'; // Only warnings and errors in production
      case 'test':
        return 'debug'; // Allow all logs in tests for better debugging
      case 'development':
      default:
        return 'debug'; // All logs in development
    }
  }

  /**
   * Get current environment
   */
  private getEnvironment(): string {
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }
    return 'development';
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    return this.LOG_LEVELS[level] >= this.LOG_LEVELS[this.config.level];
  }

  /**
   * Format log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    const parts: string[] = [];

    // Add timestamp
    if (this.config.timestamps) {
      parts.push(`[${entry.timestamp}]`);
    }

    // Add environment
    if (this.config.environment !== 'development') {
      parts.push(`[${this.config.environment.toUpperCase()}]`);
    }

    // Add level
    parts.push(`[${entry.level.toUpperCase()}]`);

    // Add prefix
    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }

    // Add message
    parts.push(entry.message);

    return parts.join(' ');
  }

  /**
   * Output log entry to console
   */
  private outputLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const formattedMessage = this.formatLogEntry(entry);

    // Choose appropriate console method
    switch (entry.level) {
      case 'debug':
        console.debug(formattedMessage, entry.context);
        break;
      case 'info':
        console.info(formattedMessage, entry.context);
        break;
      case 'warn':
        console.warn(formattedMessage, entry.context);
        break;
      case 'error':
        console.error(formattedMessage, entry.context, entry.error);
        break;
    }
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.config.includeContext ? context : undefined,
      error,
    };
  }

  /**
   * Log debug message (development only, most verbose)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, context);
    this.outputLog(entry);
  }

  /**
   * Log info message (general information)
   */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, context);
    this.outputLog(entry);
  }

  /**
   * Log warning message (potential issues)
   */
  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, context);
    this.outputLog(entry);
  }

  /**
   * Log error message (actual errors)
   */
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.outputLog(entry);
  }

  /**
   * Log API operations
   */
  api(operation: string, context?: Record<string, unknown>): void {
    this.debug(`API: ${operation}`, context);
  }

  /**
   * Log authentication events
   */
  auth(event: string, context?: Record<string, unknown>): void {
    // Be careful not to log sensitive information
    const safeContext = context ? { ...context } : {};
    // Remove potentially sensitive fields
    delete safeContext.password;
    delete safeContext.token;
    delete safeContext.secret;

    this.info(`Auth: ${event}`, safeContext);
  }

  /**
   * Log real-time/subscription events
   */
  realtime(event: string, context?: Record<string, unknown>): void {
    this.debug(`Realtime: ${event}`, context);
  }

  /**
   * Log component lifecycle events
   */
  component(
    component: string,
    event: string,
    context?: Record<string, unknown>
  ): void {
    this.debug(`Component [${component}]: ${event}`, context);
  }

  /**
   * Create a child logger with a specific prefix
   */
  createChild(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: this.config.prefix ? `${this.config.prefix}:${prefix}` : prefix,
    });
  }

  /**
   * Update logger configuration
   */
  configure(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

// Create and export default logger instance
export const logger = new Logger();

// Export specialized loggers for different modules
export const authLogger = logger.createChild('Auth');

// Export Logger class for custom instances
export { Logger };
