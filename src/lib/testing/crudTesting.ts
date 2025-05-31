
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Comprehensive CRUD testing utilities
 * These functions test all database operations to ensure data integrity
 */

interface TestResult {
  operation: string;
  success: boolean;
  error?: string;
  data?: any;
  duration: number;
}

interface TestSuite {
  suiteName: string;
  results: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
}

/**
 * Test task CRUD operations
 */
export const testTaskCRUD = async (): Promise<TestSuite> => {
  const results: TestResult[] = [];
  const startTime = Date.now();
  let testTaskId: string | null = null;

  console.log('🧪 Starting Task CRUD Tests...');

  // Test 1: Create Task
  try {
    const createStart = Date.now();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: 'Test Task',
        description: 'Test description for CRUD validation',
        owner_id: user.user.id,
        status: 'pending',
        pinned: false,
      })
      .select()
      .single();

    if (error) throw error;
    
    testTaskId = data.id;
    results.push({
      operation: 'CREATE Task',
      success: true,
      data: data,
      duration: Date.now() - createStart,
    });
  } catch (error) {
    results.push({
      operation: 'CREATE Task',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - Date.now(),
    });
  }

  // Test 2: Read Task
  if (testTaskId) {
    try {
      const readStart = Date.now();
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', testTaskId)
        .single();

      if (error) throw error;

      results.push({
        operation: 'READ Task',
        success: true,
        data: data,
        duration: Date.now() - readStart,
      });
    } catch (error) {
      results.push({
        operation: 'READ Task',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - Date.now(),
      });
    }
  }

  // Test 3: Update Task
  if (testTaskId) {
    try {
      const updateStart = Date.now();
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: 'Updated Test Task',
          description: 'Updated description',
          status: 'complete',
        })
        .eq('id', testTaskId)
        .select()
        .single();

      if (error) throw error;

      results.push({
        operation: 'UPDATE Task',
        success: true,
        data: data,
        duration: Date.now() - updateStart,
      });
    } catch (error) {
      results.push({
        operation: 'UPDATE Task',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - Date.now(),
      });
    }
  }

  // Test 4: Delete Task
  if (testTaskId) {
    try {
      const deleteStart = Date.now();
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', testTaskId);

      if (error) throw error;

      results.push({
        operation: 'DELETE Task',
        success: true,
        duration: Date.now() - deleteStart,
      });
    } catch (error) {
      results.push({
        operation: 'DELETE Task',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - Date.now(),
      });
    }
  }

  const totalDuration = Date.now() - startTime;
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    suiteName: 'Task CRUD Operations',
    results,
    totalDuration,
    passed,
    failed,
  };
};

/**
 * Test profile CRUD operations
 */
export const testProfileCRUD = async (): Promise<TestSuite> => {
  const results: TestResult[] = [];
  const startTime = Date.now();

  console.log('🧪 Starting Profile CRUD Tests...');

  // Test 1: Read Current Profile
  try {
    const readStart = Date.now();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();

    if (error) throw error;

    results.push({
      operation: 'READ Profile',
      success: true,
      data: data,
      duration: Date.now() - readStart,
    });
  } catch (error) {
    results.push({
      operation: 'READ Profile',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - Date.now(),
    });
  }

  // Test 2: Update Profile
  try {
    const updateStart = Date.now();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: 'Test User Updated',
      })
      .eq('id', user.user.id)
      .select()
      .single();

    if (error) throw error;

    results.push({
      operation: 'UPDATE Profile',
      success: true,
      data: data,
      duration: Date.now() - updateStart,
    });
  } catch (error) {
    results.push({
      operation: 'UPDATE Profile',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - Date.now(),
    });
  }

  // Test 3: List All Profiles (for user search)
  try {
    const listStart = Date.now();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name')
      .limit(10);

    if (error) throw error;

    results.push({
      operation: 'LIST Profiles',
      success: true,
      data: { count: data.length },
      duration: Date.now() - listStart,
    });
  } catch (error) {
    results.push({
      operation: 'LIST Profiles',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - Date.now(),
    });
  }

  const totalDuration = Date.now() - startTime;
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    suiteName: 'Profile CRUD Operations',
    results,
    totalDuration,
    passed,
    failed,
  };
};

/**
 * Test data validation constraints
 */
export const testValidationConstraints = async (): Promise<TestSuite> => {
  const results: TestResult[] = [];
  const startTime = Date.now();

  console.log('🧪 Starting Validation Constraint Tests...');

  // Test 1: Invalid Email Format
  try {
    const testStart = Date.now();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('profiles')
      .update({ email: 'invalid-email' })
      .eq('id', user.user.id);

    if (error) {
      // This should fail, so error is expected
      results.push({
        operation: 'VALIDATE Email Format (should fail)',
        success: true,
        data: { constraintWorking: true },
        duration: Date.now() - testStart,
      });
    } else {
      // This should not succeed
      results.push({
        operation: 'VALIDATE Email Format (should fail)',
        success: false,
        error: 'Constraint not working - invalid email was accepted',
        duration: Date.now() - testStart,
      });
    }
  } catch (error) {
    results.push({
      operation: 'VALIDATE Email Format (should fail)',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - Date.now(),
    });
  }

  // Test 2: Invalid Task Title Length
  try {
    const testStart = Date.now();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('tasks')
      .insert({
        title: 'This title is way too long and should be rejected by the database constraint',
        owner_id: user.user.id,
      });

    if (error) {
      // This should fail, so error is expected
      results.push({
        operation: 'VALIDATE Task Title Length (should fail)',
        success: true,
        data: { constraintWorking: true },
        duration: Date.now() - testStart,
      });
    } else {
      // This should not succeed
      results.push({
        operation: 'VALIDATE Task Title Length (should fail)',
        success: false,
        error: 'Constraint not working - long title was accepted',
        duration: Date.now() - testStart,
      });
    }
  } catch (error) {
    results.push({
      operation: 'VALIDATE Task Title Length (should fail)',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - Date.now(),
    });
  }

  const totalDuration = Date.now() - startTime;
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    suiteName: 'Validation Constraints',
    results,
    totalDuration,
    passed,
    failed,
  };
};

/**
 * Run all CRUD tests
 */
export const runAllCRUDTests = async (): Promise<TestSuite[]> => {
  console.log('🚀 Starting Comprehensive CRUD Testing...');
  toast.info('Running database tests...');

  const suites: TestSuite[] = [];

  try {
    // Run all test suites
    const taskSuite = await testTaskCRUD();
    const profileSuite = await testProfileCRUD();
    const validationSuite = await testValidationConstraints();

    suites.push(taskSuite, profileSuite, validationSuite);

    // Log results
    suites.forEach(suite => {
      console.log(`\n📊 ${suite.suiteName}:`);
      console.log(`   ✅ Passed: ${suite.passed}`);
      console.log(`   ❌ Failed: ${suite.failed}`);
      console.log(`   ⏱️ Duration: ${suite.totalDuration}ms`);
      
      suite.results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`   ${status} ${result.operation} (${result.duration}ms)`);
        if (result.error) {
          console.log(`      Error: ${result.error}`);
        }
      });
    });

    const totalPassed = suites.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = suites.reduce((sum, suite) => sum + suite.failed, 0);
    const totalDuration = suites.reduce((sum, suite) => sum + suite.totalDuration, 0);

    console.log(`\n🏁 Test Summary:`);
    console.log(`   ✅ Total Passed: ${totalPassed}`);
    console.log(`   ❌ Total Failed: ${totalFailed}`);
    console.log(`   ⏱️ Total Duration: ${totalDuration}ms`);

    if (totalFailed === 0) {
      toast.success(`All tests passed! (${totalPassed}/${totalPassed})`);
    } else {
      toast.error(`Some tests failed (${totalPassed}/${totalPassed + totalFailed})`);
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error);
    toast.error('Test execution failed');
  }

  return suites;
};
