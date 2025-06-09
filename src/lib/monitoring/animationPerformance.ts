/**
 * Animation Performance Monitoring System
 * 
 * Tracks animation performance metrics for optimization and debugging
 */

interface AnimationMetrics {
  frameRate: number;
  duration: number;
  jankCount: number;
  memoryDelta: number;
  completionRate: number;
}

interface PerformanceEntry {
  animationId: string;
  startTime: number;
  endTime?: number;
  frameCount: number;
  metrics?: Partial<AnimationMetrics>;
}

class AnimationPerformanceMonitor {
  private activeAnimations = new Map<string, PerformanceEntry>();
  private metrics = new Map<string, AnimationMetrics>();
  private performanceObserver?: PerformanceObserver;
  private isMonitoring = false;

  /**
   * Start monitoring an animation
   */
  startTracking(animationId: string): void {
    const startTime = performance.now();
    const memoryBefore = this.getMemoryUsage();
    
    this.activeAnimations.set(animationId, {
      animationId,
      startTime,
      frameCount: 0,
      metrics: { memoryDelta: -memoryBefore }
    });

    // Start frame rate monitoring for this animation
    this.monitorFrameRate(animationId);
  }

  /**
   * Stop monitoring and record final metrics
   */
  stopTracking(animationId: string, completed = true): AnimationMetrics | null {
    const entry = this.activeAnimations.get(animationId);
    if (!entry) return null;

    const endTime = performance.now();
    const duration = endTime - entry.startTime;
    const frameRate = this.calculateFrameRate(entry.frameCount, duration);
    const memoryAfter = this.getMemoryUsage();
    const memoryDelta = memoryAfter + (entry.metrics?.memoryDelta || 0);

    const metrics: AnimationMetrics = {
      frameRate,
      duration,
      jankCount: this.detectJank(duration),
      memoryDelta,
      completionRate: completed ? 1 : 0,
    };

    this.metrics.set(animationId, metrics);
    this.activeAnimations.delete(animationId);

    // Report to analytics in production
    this.reportMetrics(animationId, metrics);

    return metrics;
  }

  /**
   * Monitor frame rate for a specific animation
   */
  private monitorFrameRate(animationId: string): void {
    const entry = this.activeAnimations.get(animationId);
    if (!entry) return;

    const trackFrame = () => {
      const currentEntry = this.activeAnimations.get(animationId);
      if (currentEntry) {
        currentEntry.frameCount++;
        requestAnimationFrame(trackFrame);
      }
    };

    requestAnimationFrame(trackFrame);
  }

  /**
   * Calculate effective frame rate
   */
  private calculateFrameRate(frameCount: number, duration: number): number {
    return Math.round((frameCount / duration) * 1000);
  }

  /**
   * Detect animation jank (simplified implementation)
   */
  private detectJank(duration: number): number {
    // Basic jank detection: if animation took significantly longer than expected
    const expectedDuration = 300; // ms
    return duration > expectedDuration * 1.5 ? 1 : 0;
  }

  /**
   * Get current memory usage (if available)
   */
  private getMemoryUsage(): number {
    return (performance as any).memory?.usedJSHeapSize || 0;
  }

  /**
   * Initialize performance monitoring
   */
  initializeMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;

    // Monitor long tasks for jank detection
    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // Track long tasks that might affect animations
        entries.forEach((entry) => {
          if (entry.duration > 16) { // More than one frame
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['longtask'] });
      this.isMonitoring = true;
    } catch (error) {
      // Long Task API not supported
      console.info('Long Task API not supported, using simplified monitoring');
    }
  }

  /**
   * Get metrics for a specific animation
   */
  getMetrics(animationId: string): AnimationMetrics | undefined {
    return this.metrics.get(animationId);
  }

  /**
   * Get all collected metrics
   */
  getAllMetrics(): Map<string, AnimationMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Report metrics to analytics/monitoring service
   */
  private reportMetrics(animationId: string, metrics: AnimationMetrics): void {
    // Only report in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.REACT_APP_MONITOR_ANIMATIONS) {
      return;
    }

    // Integration point for analytics services
    // Example: Google Analytics, DataDog, etc.
    console.info(`Animation Performance [${animationId}]:`, metrics);
  }

  /**
   * Clean up monitoring
   */
  destroy(): void {
    this.performanceObserver?.disconnect();
    this.activeAnimations.clear();
    this.metrics.clear();
    this.isMonitoring = false;
  }
}

// Singleton instance
export const animationMonitor = new AnimationPerformanceMonitor();

// Auto-initialize monitoring
if (typeof window !== 'undefined') {
  animationMonitor.initializeMonitoring();
}

// ===== HOOKS FOR COMPONENT INTEGRATION =====

/**
 * Hook to easily track animation performance in components
 */
export function useAnimationPerformance(animationId: string) {
  const startTracking = () => animationMonitor.startTracking(animationId);
  const stopTracking = (completed = true) => animationMonitor.stopTracking(animationId, completed);
  const getMetrics = () => animationMonitor.getMetrics(animationId);

  return {
    startTracking,
    stopTracking,
    getMetrics,
  };
}

/**
 * Hook for React Spring animation performance tracking
 */
export function useSpringPerformance(animationId: string) {
  const { startTracking, stopTracking, getMetrics } = useAnimationPerformance(animationId);

  return {
    // React Spring event handlers
    onStart: startTracking,
    onRest: () => stopTracking(true),
    onPause: () => stopTracking(false),
    getMetrics,
  };
}

export default animationMonitor; 