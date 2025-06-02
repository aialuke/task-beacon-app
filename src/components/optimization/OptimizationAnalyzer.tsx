import React, { useState, useEffect } from 'react';
import { componentAnalyzer } from '@/lib/utils/componentOptimization';
import { performanceMonitor } from '@/lib/utils/performance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface OptimizationAnalyzerProps {
  showInProduction?: boolean;
}

interface ComponentReport {
  totalComponents: number;
  optimizationCandidates: ComponentInfo[];
  slowestComponents: ComponentInfo[];
  mostActiveComponents: ComponentInfo[];
}

interface ComponentInfo {
  name: string;
  totalRenders: number;
  averageRenderTime: number;
  slowRenders: number;
}

interface PerformanceReport {
  webVitals: Record<string, number>;
}

interface AnalysisReport {
  components: ComponentReport;
  performance: PerformanceReport;
  timestamp: number;
}

/**
 * Development tool for analyzing component performance and providing optimization suggestions
 */
export const OptimizationAnalyzer: React.FC<OptimizationAnalyzerProps> = ({ 
  showInProduction = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Only show in development unless explicitly enabled
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    const updateReport = () => {
      const componentReport = componentAnalyzer.getReport();
      const performanceReport = performanceMonitor.getReport();
      
      setReport({
        components: componentReport,
        performance: performanceReport,
        timestamp: Date.now()
      });
    };

    updateReport();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateReport, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [shouldShow, autoRefresh]);

  if (!shouldShow) return null;

  const handleClearData = () => {
    componentAnalyzer.clear();
    performanceMonitor.clear();
    setReport(null);
  };

  const getOptimizationScore = () => {
    if (!report?.components) return 0;
    
    const { totalComponents, optimizationCandidates } = report.components;
    if (totalComponents === 0) return 100;
    
    const score = Math.max(0, 100 - (optimizationCandidates.length / totalComponents) * 100);
    return Math.round(score);
  };

  const optimizationScore = getOptimizationScore();

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        size="sm"
        variant="outline"
        className="mb-2 bg-white shadow-lg hover:bg-gray-50"
      >
        <Activity className="h-4 w-4 mr-1" />
        Optimization Analyzer
        {report?.components?.optimizationCandidates?.length > 0 && (
          <Badge variant="destructive" className="ml-2">
            {report.components.optimizationCandidates.length}
          </Badge>
        )}
      </Button>

      {/* Analyzer Panel */}
      {isVisible && report && (
        <Card className="w-96 max-h-[600px] overflow-hidden bg-white shadow-xl border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Optimization Analyzer
                </CardTitle>
                <CardDescription>
                  Component performance insights
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  size="sm"
                  variant={autoRefresh ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Optimization Score */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Optimization Score</span>
                <span className={`text-sm font-bold ${
                  optimizationScore >= 80 ? 'text-green-600' :
                  optimizationScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {optimizationScore}%
                </span>
              </div>
              <Progress 
                value={optimizationScore} 
                className="h-2"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <div className="px-4 pb-4 max-h-96 overflow-y-auto">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {report.components.totalComponents}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Components
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-destructive">
                        {report.components.optimizationCandidates.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Need Optimization
                      </div>
                    </div>
                  </div>

                  {/* Performance Summary */}
                  {Object.keys(report.performance.webVitals).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Web Vitals</h4>
                      <div className="space-y-2">
                        {Object.entries(report.performance.webVitals).map(([metric, value]) => (
                          <div key={metric} className="flex justify-between text-sm">
                            <span>{metric}:</span>
                            <Badge variant={Number(value) > 1000 ? "destructive" : "secondary"}>
                              {Math.round(Number(value))}ms
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Components Tab */}
                <TabsContent value="components" className="mt-0 space-y-3">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Slowest Components
                    </h4>
                    <div className="space-y-2">
                      {report.components.slowestComponents.slice(0, 5).map((component: ComponentInfo) => (
                        <div key={component.name} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium truncate max-w-32">
                              {component.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {component.totalRenders} renders
                            </div>
                          </div>
                          <Badge variant={component.averageRenderTime > 16 ? "destructive" : "secondary"}>
                            {component.averageRenderTime.toFixed(1)}ms
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Activity className="h-4 w-4 mr-1" />
                      Most Active
                    </h4>
                    <div className="space-y-2">
                      {report.components.mostActiveComponents.slice(0, 5).map((component: ComponentInfo) => (
                        <div key={component.name} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                          <div className="font-medium truncate max-w-40">
                            {component.name}
                          </div>
                          <Badge variant="outline">
                            {component.totalRenders}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Suggestions Tab */}
                <TabsContent value="suggestions" className="mt-0 space-y-3">
                  {report.components.optimizationCandidates.length > 0 ? (
                    <div className="space-y-3">
                      {report.components.optimizationCandidates.map((component: ComponentInfo) => (
                        <Alert key={component.name}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="font-medium">{component.name}</div>
                            <div className="text-xs mt-1">
                              Avg: {component.averageRenderTime.toFixed(1)}ms • 
                              Renders: {component.totalRenders} • 
                              Slow: {Math.round((component.slowRenders / component.totalRenders) * 100)}%
                            </div>
                            <div className="text-xs mt-2 text-muted-foreground">
                              💡 Consider using React.memo() or optimizing render logic
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium">All components optimized!</div>
                        <div className="text-xs mt-1">
                          No performance issues detected. Great job! 🎉
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* General Tips */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Optimization Tips</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Use React.memo() for components with stable props</div>
                      <div>• Memoize expensive calculations with useMemo()</div>
                      <div>• Use useCallback() for event handlers</div>
                      <div>• Avoid creating objects/arrays in render</div>
                      <div>• Consider code splitting for large components</div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer Actions */}
            <div className="border-t p-4">
              <div className="flex justify-between">
                <Button
                  onClick={handleClearData}
                  size="sm"
                  variant="outline"
                >
                  Clear Data
                </Button>
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(report.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 