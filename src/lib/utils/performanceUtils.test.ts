import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  measureFunctionPerformance,
  createPerformanceObserver,
  getMemoryUsage,
  logPerformanceMetrics,
  debounce,
  throttle,
  PERFORMANCE_THRESHOLDS,
} from './performanceUtils';

// Mock Performance API
const mockPerformance = {
  now: vi.fn(),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
};

// Mock console methods
const mockConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  group: vi.fn(),
  groupEnd: vi.fn(),
};

describe('performanceUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global performance object
    global.performance = mockPerformance as any;
    global.console = mockConsole as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('measureFunctionPerformance', () => {
    it('should measure synchronous function performance', async () => {
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1050);

      const testFunction = vi.fn().mockReturnValue('test result');
      const result = await measureFunctionPerformance('testFunction', testFunction);

      expect(result).toEqual({
        result: 'test result',
        duration: 50,
        functionName: 'testFunction',
        timestamp: expect.any(Number),
      });

      expect(testFunction).toHaveBeenCalledOnce();
      expect(mockPerformance.now).toHaveBeenCalledTimes(2);
    });

    it('should measure asynchronous function performance', async () => {
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1100);

      const asyncFunction = vi.fn().mockResolvedValue('async result');
      const result = await measureFunctionPerformance('asyncFunction', asyncFunction);

      expect(result).toEqual({
        result: 'async result',
        duration: 100,
        functionName: 'asyncFunction',
        timestamp: expect.any(Number),
      });

      expect(asyncFunction).toHaveBeenCalledOnce();
    });

    it('should handle function errors and still return performance data', async () => {
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1025);

      const errorFunction = vi.fn().mockRejectedValue(new Error('Test error'));

      await expect(measureFunctionPerformance('errorFunction', errorFunction)).rejects.toThrow('Test error');

      expect(errorFunction).toHaveBeenCalledOnce();
      expect(mockPerformance.now).toHaveBeenCalledTimes(2);
    });

    it('should warn about slow function execution', async () => {
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1500); // 500ms duration

      const slowFunction = vi.fn().mockReturnValue('slow result');
      await measureFunctionPerformance('slowFunction', slowFunction);

      expect(mockConsole.warn).toHaveBeenCalledWith(
        '⚠️ Slow function execution:',
        'slowFunction',
        'took',
        500,
        'ms'
      );
    });
  });

  describe('createPerformanceObserver', () => {
    it('should create a performance observer for navigation entries', () => {
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };

      // Mock PerformanceObserver constructor
      global.PerformanceObserver = vi.fn().mockImplementation((callback) => {
        // Simulate calling the callback with mock entries
        setTimeout(() => {
          callback({
            getEntries: () => [
              {
                name: 'navigation',
                duration: 1500,
                type: 'navigation',
                loadEventEnd: 1500,
                domContentLoadedEventEnd: 800,
              },
            ],
          });
        }, 0);
        return mockObserver;
      });

      const observer = createPerformanceObserver('navigation');

      expect(global.PerformanceObserver).toHaveBeenCalledWith(expect.any(Function));
      expect(mockObserver.observe).toHaveBeenCalledWith({ entryTypes: ['navigation'] });
      expect(observer).toBe(mockObserver);
    });

    it('should handle performance observer creation errors gracefully', () => {
      global.PerformanceObserver = vi.fn().mockImplementation(() => {
        throw new Error('PerformanceObserver not supported');
      });

      const observer = createPerformanceObserver('navigation');

      expect(observer).toBeNull();
      expect(mockConsole.warn).toHaveBeenCalledWith(
        'PerformanceObserver not supported:',
        expect.any(Error)
      );
    });
  });

  describe('getMemoryUsage', () => {
    it('should return memory usage information when available', () => {
      const memoryInfo = getMemoryUsage();

      expect(memoryInfo).toEqual({
        usedJSHeapSize: 1000000,
        totalJSHeapSize: 2000000,
        jsHeapSizeLimit: 4000000,
        usedPercentage: 50, // 1MB / 2MB * 100
      });
    });

    it('should return null when memory API is not available', () => {
      global.performance = { ...mockPerformance, memory: undefined } as any;

      const memoryInfo = getMemoryUsage();

      expect(memoryInfo).toBeNull();
    });

    it('should warn when memory usage exceeds threshold', () => {
      global.performance = {
        ...mockPerformance,
        memory: {
          usedJSHeapSize: 3500000, // 3.5MB
          totalJSHeapSize: 4000000, // 4MB
          jsHeapSizeLimit: 4000000,
        },
      } as any;

      getMemoryUsage();

      expect(mockConsole.warn).toHaveBeenCalledWith(
        '⚠️ High memory usage detected:',
        '87.5%'
      );
    });
  });

  describe('logPerformanceMetrics', () => {
    it('should log comprehensive performance metrics', () => {
      mockPerformance.getEntriesByType.mockReturnValue([
        {
          name: 'navigation',
          duration: 1200,
          loadEventEnd: 1200,
          domContentLoadedEventEnd: 600,
          type: 'navigation',
        },
      ]);

      logPerformanceMetrics();

      expect(mockConsole.group).toHaveBeenCalledWith('📊 Performance Metrics');
      expect(mockConsole.log).toHaveBeenCalledWith('Navigation timing:', expect.any(Object));
      expect(mockConsole.log).toHaveBeenCalledWith('Memory usage:', expect.any(Object));
      expect(mockConsole.groupEnd).toHaveBeenCalled();
    });

    it('should warn about poor performance metrics', () => {
      mockPerformance.getEntriesByType.mockReturnValue([
        {
          name: 'navigation',
          duration: 4000, // Exceeds threshold
          loadEventEnd: 4000,
          domContentLoadedEventEnd: 2500, // Exceeds threshold
          type: 'navigation',
        },
      ]);

      logPerformanceMetrics();

      expect(mockConsole.warn).toHaveBeenCalledWith(
        '⚠️ Slow page load detected:',
        4000,
        'ms'
      );
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '⚠️ Slow DOM content loaded:',
        2500,
        'ms'
      );
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFunction = vi.fn();
      const debouncedFunction = debounce(mockFunction, 100);

      // Call multiple times rapidly
      debouncedFunction('arg1');
      debouncedFunction('arg2');
      debouncedFunction('arg3');

      // Function should not be called immediately
      expect(mockFunction).not.toHaveBeenCalled();

      // Wait for debounce delay
      await new Promise(resolve => setTimeout(resolve, 150));

      // Function should be called once with the last arguments
      expect(mockFunction).toHaveBeenCalledOnce();
      expect(mockFunction).toHaveBeenCalledWith('arg3');
    });

    it('should cancel previous debounced calls', async () => {
      const mockFunction = vi.fn();
      const debouncedFunction = debounce(mockFunction, 100);

      debouncedFunction('first');
      
      // Wait half the delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      debouncedFunction('second');
      
      // Wait for the full delay from the second call
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(mockFunction).toHaveBeenCalledOnce();
      expect(mockFunction).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const mockFunction = vi.fn();
      const throttledFunction = throttle(mockFunction, 100);

      // Call immediately - should execute
      throttledFunction('first');
      expect(mockFunction).toHaveBeenCalledWith('first');

      // Call again immediately - should be ignored
      throttledFunction('second');
      expect(mockFunction).toHaveBeenCalledTimes(1);

      // Wait for throttle period
      await new Promise(resolve => setTimeout(resolve, 150));

      // Call again - should execute
      throttledFunction('third');
      expect(mockFunction).toHaveBeenCalledTimes(2);
      expect(mockFunction).toHaveBeenLastCalledWith('third');
    });

    it('should maintain correct context when throttled', () => {
      const context = { value: 'test' };
      const mockFunction = vi.fn(function(this: typeof context) {
        return this.value;
      });

      const throttledFunction = throttle(mockFunction, 100);
      throttledFunction.call(context);

      expect(mockFunction).toHaveBeenCalledOnce();
    });
  });

  describe('PERFORMANCE_THRESHOLDS', () => {
    it('should export correct performance thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS).toEqual({
        SLOW_FUNCTION: 100,
        SLOW_PAGE_LOAD: 3000,
        SLOW_DOM_CONTENT: 2000,
        HIGH_MEMORY_USAGE: 80,
      });
    });
  });
}); 