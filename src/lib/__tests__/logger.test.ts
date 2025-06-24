import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Logger, authLogger } from '../logger';

// Mock console methods
const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe('Logger', () => {
  let testLogger: Logger;

  beforeEach(() => {
    // Reset console mocks
    Object.assign(console, mockConsole);
    Object.values(mockConsole).forEach(fn => fn.mockClear());

    testLogger = new Logger({
      level: 'debug',
      timestamps: false,
      includeContext: true,
      environment: 'test',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('log levels', () => {
    it('should log debug messages when level is debug', () => {
      const consoleSpy = vi
        .spyOn(console, 'debug')
        .mockImplementation(() => {});
      testLogger.debug('test debug message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should not log debug messages when level is info', () => {
      testLogger.configure({ level: 'info' });
      const consoleSpy = vi
        .spyOn(console, 'debug')
        .mockImplementation(() => {});
      testLogger.debug('test debug message');
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log info messages when level is info', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      testLogger.info('test info message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log warn messages', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      testLogger.warn('test warn message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log error messages', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      testLogger.error('test error message');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('context handling', () => {
    it('should include context when includeContext is true', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      testLogger.info('test message', { key: 'value' });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test message'),
        { key: 'value' },
      );
      consoleSpy.mockRestore();
    });

    it('should not include context when includeContext is false', () => {
      testLogger.configure({ includeContext: false });
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      testLogger.info('test message', { key: 'value' });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test message'),
        undefined,
      );
      consoleSpy.mockRestore();
    });
  });

  describe('prefix handling', () => {
    it('should include prefix in log messages', () => {
      const prefixedLogger = new Logger({ prefix: 'TEST' });
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      prefixedLogger.info('test message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [TEST] test message'),
        undefined,
      );
      consoleSpy.mockRestore();
    });
  });

  describe('child loggers', () => {
    it('should create child logger with combined prefix', () => {
      const parentLogger = new Logger({ prefix: 'PARENT' });
      const childLogger = parentLogger.createChild('CHILD');
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      childLogger.info('test message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [PARENT:CHILD] test message'),
        undefined,
      );
      consoleSpy.mockRestore();
    });
  });

  describe('specialized loggers', () => {
    it('should have auth logger with correct prefix', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      authLogger.info('auth event');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [Auth] auth event'),
        undefined,
      );
      consoleSpy.mockRestore();
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      testLogger.configure({ level: 'warn' });
      expect(testLogger.getConfig().level).toBe('warn');
    });

    it('should return current configuration', () => {
      const config = testLogger.getConfig();
      expect(config).toHaveProperty('level');
      expect(config).toHaveProperty('timestamps');
      expect(config).toHaveProperty('includeContext');
    });
  });

  describe('auth logging', () => {
    it('should remove sensitive information from auth logs', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      testLogger.auth('login', {
        username: 'test',
        password: 'secret',
        token: 'jwt-token',
        secret: 'api-secret',
      });

      const logCall = consoleSpy.mock.calls[0];
      const context = logCall[1];

      expect(context).toHaveProperty('username', 'test');
      expect(context).not.toHaveProperty('password');
      expect(context).not.toHaveProperty('token');
      expect(context).not.toHaveProperty('secret');

      consoleSpy.mockRestore();
    });
  });
});
