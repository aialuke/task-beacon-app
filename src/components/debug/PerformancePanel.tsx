/**
 * Performance Panel - Debug Component for Phase 3 Monitoring
 * 
 * Displays real-time performance metrics during development
 */

import React, { useState, useEffect } from 'react';

import { performanceMonitor } from '@/lib/performance/PerformanceMonitor';

interface PerformancePanelProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export function PerformancePanel({ isVisible = false, onToggle }: PerformancePanelProps) {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh metrics every 5 seconds
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setRefreshKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const slowRoutes = performanceMonitor.getSlowRoutes(500);
  
  const exportMetrics = () => {
    const report = performanceMonitor.exportMetrics();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible || !import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-96 max-w-md overflow-auto rounded-lg bg-black/90 p-4 text-xs text-white">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Performance Monitor</h3>
        <div className="flex gap-2">
          <button
            onClick={exportMetrics}
            className="rounded bg-blue-600 px-2 py-1 text-xs hover:bg-blue-700"
          >
            Export
          </button>
          <button
            onClick={onToggle}
            className="rounded bg-red-600 px-2 py-1 text-xs hover:bg-red-700"
          >
            ×
          </button>
        </div>
      </div>

      {/* Route Performance */}
      <div className="mb-3">
        <h4 className="mb-1 font-medium">Route Performance</h4>
        {Object.keys(metrics.routeChanges).length === 0 ? (
          <p className="text-gray-400">No route data yet</p>
        ) : (
          <div className="space-y-1">
            {Object.entries(metrics.routeChanges).slice(0, 5).map(([route, timings]) => {
              const perf = performanceMonitor.getRoutePerformance(route);
              return (
                <div key={route} className="flex justify-between">
                  <span className="max-w-32 truncate" title={route}>
                    {route || '/'}
                  </span>
                  <span className={`text-right ${perf && perf.average > 1000 ? 'text-red-400' : perf && perf.average > 500 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {perf?.average}ms ({perf?.count})
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slow Routes */}
      {slowRoutes.length > 0 && (
        <div className="mb-3">
          <h4 className="mb-1 font-medium text-red-400">Slow Routes (&gt;500ms)</h4>
          <div className="space-y-1">
            {slowRoutes.slice(0, 3).map(({ route, avgDuration }) => (
              <div key={route} className="flex justify-between">
                <span className="max-w-32 truncate" title={route}>
                  {route || '/'}
                </span>
                <span className="text-red-400">{avgDuration}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bundle Loads */}
      <div className="mb-3">
        <h4 className="mb-1 font-medium">Bundle Loads</h4>
        {Object.keys(metrics.bundleLoads).length === 0 ? (
          <p className="text-gray-400">No bundle data yet</p>
        ) : (
          <div className="space-y-1">
            {Object.entries(metrics.bundleLoads)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([chunk, duration]) => (
                <div key={chunk} className="flex justify-between">
                  <span className="max-w-32 truncate" title={chunk}>
                    {chunk}
                  </span>
                  <span className={duration > 200 ? 'text-red-400' : 'text-green-400'}>
                    {Math.round(duration)}ms
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Component Renders */}
      <div className="mb-3">
        <h4 className="mb-1 font-medium">Top Renderers</h4>
        {Object.keys(metrics.componentRenders).length === 0 ? (
          <p className="text-gray-400">No render data yet</p>
        ) : (
          <div className="space-y-1">
            {Object.entries(metrics.componentRenders)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([component, count]) => (
                <div key={component} className="flex justify-between">
                  <span className="max-w-32 truncate" title={component}>
                    {component}
                  </span>
                  <span className={count > 20 ? 'text-red-400' : count > 10 ? 'text-yellow-400' : 'text-green-400'}>
                    {count}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Updates every 5s • Key: {refreshKey}
      </div>
    </div>
  );
}

// Performance Panel Toggle Hook
export function usePerformancePanel() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle with Ctrl+Shift+P
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    if (import.meta.env.DEV) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  return {
    isVisible,
    toggle: () => setIsVisible(prev => !prev),
  };
} 