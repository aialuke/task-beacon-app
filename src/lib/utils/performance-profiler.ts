/**
 * Performance Profiler for Initialization Chain
 * 
 * Measures and reports initialization performance metrics
 */

interface InitializationMetrics {
  startTime: number;
  providerSetupTime: number;
  authInitTime: number;
  themeInitTime: number;
  totalInitTime: number;
}

class InitializationProfiler {
  private metrics: Partial<InitializationMetrics> = {};
  private markers: Map<string, number> = new Map();

  mark(label: string): void {
    this.markers.set(label, performance.now());
  }

  measure(startLabel: string, endLabel?: string): number {
    const startTime = this.markers.get(startLabel);
    const endTime = endLabel ? this.markers.get(endLabel) : performance.now();
    
    if (!startTime) {
      console.warn(`Performance marker '${startLabel}' not found`);
      return 0;
    }
    
    return (endTime || performance.now()) - startTime;
  }

  recordProviderSetup(): void {
    this.metrics.providerSetupTime = this.measure('app-start', 'providers-ready');
  }

  recordAuthInit(): void {
    this.metrics.authInitTime = this.measure('auth-start', 'auth-ready');
  }

  recordThemeInit(): void {
    this.metrics.themeInitTime = this.measure('theme-start', 'theme-ready');
  }

  getReport(): InitializationMetrics {
    return {
      startTime: this.markers.get('app-start') || 0,
      providerSetupTime: this.metrics.providerSetupTime || 0,
      authInitTime: this.metrics.authInitTime || 0,
      themeInitTime: this.metrics.themeInitTime || 0,
      totalInitTime: this.measure('app-start'),
    };
  }

  logReport(): void {
    const report = this.getReport();
    console.group('🚀 Initialization Performance Report');
    console.log('Provider Setup:', `${report.providerSetupTime.toFixed(2)}ms`);
    console.log('Auth Initialization:', `${report.authInitTime.toFixed(2)}ms`);
    console.log('Theme Initialization:', `${report.themeInitTime.toFixed(2)}ms`);
    console.log('Total Initialization:', `${report.totalInitTime.toFixed(2)}ms`);
    console.groupEnd();
  }
}

export const initProfiler = new InitializationProfiler();

// Auto-start profiling in development
if (import.meta.env.DEV) {
  initProfiler.mark('app-start');
} 