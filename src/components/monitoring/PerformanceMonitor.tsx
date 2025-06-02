import { useState, useEffect, memo } from 'react';
import { performanceMonitor, fpsMonitor } from '@/lib/utils/performance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOptimizedMemo } from '@/hooks/useOptimizedMemo';

interface PerformanceStats {
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  } | null;
  fps: number;
  componentMetrics: Array<{
    componentName: string;
    renderCount: number;
    averageRenderTime: number;
    propsChanges: number;
  }>;
}

const PerformanceMonitor = memo(() => {
  const [stats, setStats] = useState<PerformanceStats>({
    memoryUsage: null,
    fps: 0,
    componentMetrics: []
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Only show in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Memoize expensive operations
  const formatMemoryUsage = useOptimizedMemo(() => {
    if (!stats.memoryUsage) return null;
    
    return {
      used: `${(stats.memoryUsage.used / 1024 / 1024).toFixed(2)} MB`,
      total: `${(stats.memoryUsage.total / 1024 / 1024).toFixed(2)} MB`,
      percentage: `${stats.memoryUsage.percentage.toFixed(1)}%`
    };
  }, [stats.memoryUsage], { name: 'format-memory', warnOnSlowComputation: false });

  const topComponentsData = useOptimizedMemo(() => {
    return stats.componentMetrics
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
      .slice(0, 5);
  }, [stats.componentMetrics], { name: 'top-components', warnOnSlowComputation: false });

  useEffect(() => {
    if (!isDevelopment) return;

    let interval: NodeJS.Timeout | null = null;

    if (isTracking) {
      fpsMonitor.start();
      
      interval = setInterval(() => {
        const memoryUsage = performanceMonitor.getMemoryUsage();
        const componentReport = performanceMonitor.getComponentReport();
        const currentFPS = fpsMonitor.getCurrentFPS();

        setStats({
          memoryUsage: memoryUsage ? {
            used: memoryUsage.usedJSHeapSize,
            total: memoryUsage.totalJSHeapSize,
            percentage: memoryUsage.usagePercentage
          } : null,
          fps: currentFPS,
          componentMetrics: componentReport
        });
      }, 1000);
    } else {
      fpsMonitor.stop();
    }

    return () => {
      if (interval) clearInterval(interval);
      fpsMonitor.stop();
    };
  }, [isTracking, isDevelopment]);

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      performanceMonitor.clear(); // Clear previous metrics
    }
  };

  const handleGenerateReport = () => {
    performanceMonitor.generateReport();
  };

  const handleClearMetrics = () => {
    performanceMonitor.clear();
    setStats({
      memoryUsage: null,
      fps: 0,
      componentMetrics: []
    });
  };

  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="mb-2 bg-background/80 backdrop-blur-sm"
        >
          📊 Perf
        </Button>
      </div>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-96 max-h-96 overflow-y-auto">
          <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Performance Monitor</CardTitle>
                  <CardDescription className="text-xs">
                    Real-time app performance metrics
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isTracking ? "default" : "secondary"} className="text-xs">
                    {isTracking ? "Active" : "Paused"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Control Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={isTracking ? "destructive" : "default"}
                  size="sm"
                  onClick={handleToggleTracking}
                  className="flex-1 text-xs"
                >
                  {isTracking ? "Stop" : "Start"} Tracking
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateReport}
                  className="text-xs"
                >
                  Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearMetrics}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>

              {isTracking && (
                <>
                  {/* FPS Monitor */}
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="font-medium">FPS</span>
                    <Badge 
                      variant={stats.fps < 30 ? "destructive" : stats.fps < 50 ? "secondary" : "default"}
                    >
                      {stats.fps} fps
                    </Badge>
                  </div>

                  {/* Memory Usage */}
                  {formatMemoryUsage && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Memory Usage</span>
                        <Badge 
                          variant={stats.memoryUsage && stats.memoryUsage.percentage > 80 ? "destructive" : "default"}
                        >
                          {formatMemoryUsage.percentage}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatMemoryUsage.used} / {formatMemoryUsage.total}
                      </div>
                    </div>
                  )}

                  {/* Component Performance */}
                  {topComponentsData.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-medium">Component Performance</span>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {topComponentsData.map((component) => (
                          <div 
                            key={component.componentName}
                            className="flex items-center justify-between p-2 bg-muted rounded text-xs"
                          >
                            <div>
                              <div className="font-medium truncate max-w-32">
                                {component.componentName}
                              </div>
                              <div className="text-muted-foreground">
                                {component.renderCount} renders, {component.propsChanges} prop changes
                              </div>
                            </div>
                            <Badge 
                              variant={component.averageRenderTime > 10 ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {component.averageRenderTime.toFixed(1)}ms
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Performance Tips */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="font-medium">💡 Performance Tips:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>Keep renders under 16ms for 60fps</li>
                      <li>Use React.memo for expensive components</li>
                      <li>Minimize prop changes and re-renders</li>
                      <li>Monitor memory usage regularly</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor; 