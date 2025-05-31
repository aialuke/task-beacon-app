
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { runAllCRUDTests } from '@/lib/testing/crudTesting';
import { Loader2, Play, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestSuite {
  suiteName: string;
  results: any[];
  totalDuration: number;
  passed: number;
  failed: number;
}

export default function DatabaseTestPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const results = await runAllCRUDTests();
      setTestResults(results);
      setLastRun(new Date());
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getTotalStats = () => {
    const totalPassed = testResults.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = testResults.reduce((sum, suite) => sum + suite.failed, 0);
    const totalDuration = testResults.reduce((sum, suite) => sum + suite.totalDuration, 0);
    
    return { totalPassed, totalFailed, totalDuration };
  };

  const { totalPassed, totalFailed, totalDuration } = getTotalStats();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Database Integrity Testing
        </CardTitle>
        <CardDescription>
          Test all CRUD operations and validate data integrity constraints
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleRunTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            {lastRun && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last run: {lastRun.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          {testResults.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant={totalFailed === 0 ? "default" : "destructive"}>
                {totalPassed}/{totalPassed + totalFailed} Passed
              </Badge>
              <Badge variant="outline">
                {totalDuration}ms
              </Badge>
            </div>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            
            {testResults.map((suite, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{suite.suiteName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={suite.failed === 0 ? "default" : "destructive"}>
                        {suite.passed}/{suite.passed + suite.failed}
                      </Badge>
                      <Badge variant="outline">
                        {suite.totalDuration}ms
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {suite.results.map((result, resultIndex) => (
                      <div 
                        key={resultIndex}
                        className="flex items-center justify-between p-2 rounded border"
                      >
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm font-medium">
                            {result.operation}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {result.duration}ms
                          </Badge>
                          {result.error && (
                            <Badge variant="destructive" className="text-xs">
                              Error
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {suite.results.some(r => r.error) && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <h4 className="text-sm font-semibold text-red-800 mb-2">Errors:</h4>
                      {suite.results
                        .filter(r => r.error)
                        .map((result, errorIndex) => (
                          <div key={errorIndex} className="text-sm text-red-700">
                            <strong>{result.operation}:</strong> {result.error}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
