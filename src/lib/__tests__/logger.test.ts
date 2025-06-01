import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger, logger, authLogger, performanceLogger } from '../logger';

// Mock console methods
const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe('Logger', () => {
  beforeEach(() => {
    // Reset console mocks
    Object.assign(console, mockConsole);
    Object.values(mockConsole).forEach(fn => fn.mockClear());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Logger class', () => {
    it('should create logger with default configuration', () => {
      const testLogger = new Logger();
      const config = testLogger.getConfig();
      
      expect(config.level).toBe('debug'); // Default for development
      expect(config.timestamps).toBe(true);
      expect(config.includeContext).toBe(true);
      expect(config.environment).toBeDefined();
    });

    it('should create logger with custom configuration', () => {
      const testLogger = new Logger({
        level: 'warn',
        timestamps: false,
        prefix: 'TEST',
      });
      
      const config = testLogger.getConfig();
      expect(config.level).toBe('warn');
      expect(config.timestamps).toBe(false);
      expect(config.prefix).toBe('TEST');
    });

    it('should filter logs based on level', () => {
      const testLogger = new Logger({ level: 'warn' });
      
      testLogger.debug('debug message');
      testLogger.info('info message');
      testLogger.warn('warn message');
      testLogger.error('error message');
      
      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
    });

    it('should include timestamps when enabled', () => {
      const testLogger = new Logger({ timestamps: true });
      
      testLogger.info('test message');
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\].*test message$/),
        undefined
      );
    });

    it('should exclude timestamps when disabled', () => {
      const testLogger = new Logger({ timestamps: false });
      
      testLogger.info('test message');
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.not.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/),
        undefined
      );
    });

    it('should include prefix when provided', () => {
      const testLogger = new Logger({ prefix: 'TEST' });
      
      testLogger.info('test message');
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[TEST]'),
        undefined
      );
    });

    it('should include context when enabled', () => {
      const testLogger = new Logger({ includeContext: true });
      const context = { userId: '123', action: 'test' };
      
      testLogger.info('test message', context);
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('test message'),
        context
      );
    });

    it('should exclude context when disabled', () => {
      const testLogger = new Logger({ includeContext: false });
      const context = { userId: '123', action: 'test' };
      
      testLogger.info('test message', context);
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('test message'),
        undefined
      );
    });

    it('should handle error logging correctly', () => {
      const testLogger = new Logger();
      const error = new Error('Test error');
      const context = { component: 'TestComponent' };
      
      testLogger.error('Error occurred', error, context);
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('Error occurred'),
        context,
        error
      );
    });
  });

  describe('specialized loggers', () => {
    it('should create child logger with prefix', () => {
      const childLogger = logger.createChild('TEST');
      
      childLogger.info('test message');
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[TEST]'),
        undefined
      );
    });

    it('should have auth logger with correct prefix', () => {
      authLogger.info('authentication event');
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[Auth]'),
        undefined
      );
    });

    it('should have performance logger with correct prefix', () => {
      performanceLogger.debug('performance metric');
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('[Performance]'),
        undefined
      );
    });
  });

  describe('specialized logging methods', () => {
    it('should log performance metrics', () => {
      logger.performance('operation completed', { duration: 150, memory: 1024 });
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('Performance: operation completed'),
        { duration: 150, memory: 1024 }
      );
    });

    it('should log API operations', () => {
      logger.api('GET /tasks', { userId: '123' });
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('API: GET /tasks'),
        { userId: '123' }
      );
    });

    it('should log auth events with sensitive data filtered', () => {
      const context = {
        userId: '123',
        password: 'secret',
        token: 'jwt-token',
        secret: 'api-secret',
        email: 'user@example.com'
      };
      
      logger.auth('user login', context);
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('Auth: user login'),
        {
          userId: '123',
          email: 'user@example.com'
          // password, token, secret should be filtered out
        }
      );
    });

    it('should log realtime events', () => {
      logger.realtime('subscription connected', { table: 'tasks' });
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('Realtime: subscription connected'),
        { table: 'tasks' }
      );
    });

    it('should log component events', () => {
      logger.component('TaskCard', 'mounted', { taskId: '123' });
      
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('Component [TaskCard]: mounted'),
        { taskId: '123' }
      );
    });
  });

  describe('configuration updates', () => {
    it('should update configuration dynamically', () => {
      const testLogger = new Logger({ level: 'debug' });
      
      testLogger.debug('should log');
      expect(mockConsole.debug).toHaveBeenCalledTimes(1);
      
      testLogger.configure({ level: 'error' });
      testLogger.debug('should not log');
      expect(mockConsole.debug).toHaveBeenCalledTimes(1); // No additional call
      
      testLogger.error('should log');
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('environment handling', () => {
    it('should use correct log level for production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const prodLogger = new Logger();
      expect(prodLogger.getConfig().level).toBe('warn');
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should use correct log level for test', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      
      const testLogger = new Logger();
      expect(testLogger.getConfig().level).toBe('error');
      
      process.env.NODE_ENV = originalEnv;
    });
  });
}); 