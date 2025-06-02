import React, { useState, useEffect } from 'react';
import { performanceMonitor, memoryOptimizer } from '@/lib/utils/performance';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3, Zap, Trash2, RefreshCw } from 'lucide-react';

interface PerformanceMetrics {
  componentRenders: Record<string, number>;
  slowOperations: Array<{ name: string; duration: number; timestamp: number }>;
  bundleChunks: Record<string, { loaded: boolean; size?: number }>;
  webVitals: Record<string, number>;
  memoryInfo?: {
    used: number;
    total: number;
    limit: number;
  } | null;
}

/**
 * Performance monitoring dashboard component
 * 
 * Provides real-time insights into application performance including:
 * - Component render counts
 * - Slow operations tracking
 * - Bundle chunk loading
 * - Web Vitals metrics
 * - Memory usage monitoring
 */
export const PerformanceDashboard: React.FC<{ 
  className?: string;
  showInProduction?: boolean;
}> = ({ 
  className = '',
  showInProduction = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Only show in development unless explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    const updateMetrics = () => {
      const report = performanceMonitor.getReport();
      const memoryInfo = memoryOptimizer.getMemoryInfo();
      
      setMetrics({
        ...report,
        memoryInfo,
      });
    };

    // Initial load
    updateMetrics();

    // Auto-refresh every 5 seconds if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateMetrics, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [shouldShow, autoRefresh]);

  if (!shouldShow || !metrics) return null;

  const handleForceGC = () => {
    memoryOptimizer.forceGC();
    // Refresh metrics after a short delay
    setTimeout(() => {
      const report = performanceMonitor.getReport();
      const memoryInfo = memoryOptimizer.getMemoryInfo();
      setMetrics({ ...report, memoryInfo });
    }, 100);
  };

  const handleRefresh = () => {
    const report = performanceMonitor.getReport();
    const memoryInfo = memoryOptimizer.getMemoryInfo();
    setMetrics({ ...report, memoryInfo });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Toggle button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        size="sm"
        variant="outline"
        className="mb-2 bg-white shadow-lg hover:bg-gray-50"
      >
        <Activity className="h-4 w-4 mr-1" />
        Performance
        {metrics.slowOperations.length > 0 && (
          <Badge variant="destructive" className="ml-2">
            {metrics.slowOperations.length}
          </Badge>
        )}
      </Button>

      {/* Dashboard panel */}
      {isVisible && (
        <Card className="w-80 max-h-96 overflow-y-auto bg-white shadow-xl border">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Monitor
              </h3>
              <div className="flex gap-1">
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  size="sm"
                  variant={autoRefresh ? "default" : "outline"}
                  className="h-7 w-7 p-0"
                >
                  <RefreshCw className={`h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  onClick={handleRefresh}
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                >
                  <Activity className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Web Vitals */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Web Vitals</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(metrics.webVitals).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <Badge variant={value > 1000 ? "destructive" : "secondary"}>
                      {Math.round(value)}ms
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Usage */}
            {metrics.memoryInfo && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Memory Usage</h4>
                  <Button
                    onClick={handleForceGC}
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    GC
                  </Button>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Used:</span>
                    <span>{metrics.memoryInfo.used.toFixed(1)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span>{metrics.memoryInfo.total.toFixed(1)} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(metrics.memoryInfo.used / metrics.memoryInfo.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Component Renders */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Component Renders</h4>
              <div className="space-y-1 max-h-20 overflow-y-auto text-xs">
                {Object.entries(metrics.componentRenders)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([component, count]) => (
                    <div key={component} className="flex justify-between">
                      <span className="text-gray-600 truncate">{component}:</span>
                      <Badge variant={count > 10 ? "destructive" : "secondary"}>
                        {count}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            {/* Slow Operations */}
            {metrics.slowOperations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                  Recent Slow Operations
                </h4>
                <div className="space-y-1 max-h-20 overflow-y-auto text-xs">
                  {metrics.slowOperations
                    .slice(-5)
                    .reverse()
                    .map((op, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600 truncate">{op.name}:</span>
                        <Badge variant="destructive">
                          {op.duration.toFixed(1)}ms
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Bundle Chunks */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Loaded Chunks</h4>
              <div className="text-xs text-gray-600">
                {Object.keys(metrics.bundleChunks).length} chunks loaded
                {Object.values(metrics.bundleChunks).some(chunk => chunk.size) && (
                  <div className="mt-1">
                    Total: {Math.round(
                      Object.values(metrics.bundleChunks)
                        .reduce((total, chunk) => total + (chunk.size || 0), 0) / 1024
                    )} KB
                  </div>
                )}
              </div>
            </div>

            {/* Performance Tips */}
            {(metrics.slowOperations.length > 3 || 
              Object.values(metrics.componentRenders).some(count => count > 15)) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <h5 className="text-xs font-medium text-yellow-800 mb-1">
                  Performance Tips
                </h5>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {metrics.slowOperations.length > 3 && (
                    <li>• Multiple slow operations detected</li>
                  )}
                  {Object.values(metrics.componentRenders).some(count => count > 15) && (
                    <li>• Some components are re-rendering frequently</li>
                  )}
                  <li>• Consider using React.memo or useMemo</li>
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}; 