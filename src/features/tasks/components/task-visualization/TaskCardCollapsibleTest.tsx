import TaskCardCollapsible from './TaskCardCollapsible';

// Mock task data for isolated testing
const mockTask = {
  id: 'test-task-1',
  title: 'Test Task for Collapsible Functionality',
  description: 'This is a test task to verify the new collapsible functionality works correctly',
  status: 'pending',
  due_date: '2025-06-30',
  url_link: 'https://example.com',
  parent_task: null,
  user_id: 'test-user',
  created_at: '2025-06-24T10:00:00Z',
  updated_at: '2025-06-24T10:00:00Z',
  photos: []
};

const mockTask2 = {
  id: 'test-task-2',
  title: 'Second Test Task - Complete Status',
  description: 'This task tests the complete status styling',
  status: 'complete',
  due_date: null,
  url_link: null,
  parent_task: null,
  user_id: 'test-user',
  created_at: '2025-06-24T10:00:00Z',
  updated_at: '2025-06-24T10:00:00Z',
  photos: []
};

const mockTask3 = {
  id: 'test-task-3',
  title: 'Third Test Task - Overdue Status with Very Long Title That Should Truncate Properly',
  description: null,
  status: 'overdue',
  due_date: '2025-06-20',
  url_link: null,
  parent_task: null,
  user_id: 'test-user',
  created_at: '2025-06-24T10:00:00Z',
  updated_at: '2025-06-24T10:00:00Z',
  photos: []
};

function TaskCardCollapsibleTest() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-8">TaskCardCollapsible Test Environment</h1>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Scenarios:</h2>
          
          <div className="space-y-2">
            <h3 className="text-base font-medium">1. Pending Task with Full Content</h3>
            <TaskCardCollapsible task={mockTask} />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">2. Complete Task (Opacity Test)</h3>
            <TaskCardCollapsible task={mockTask2} />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">3. Overdue Task with Long Title (Truncation Test)</h3>
            <TaskCardCollapsible task={mockTask3} />
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Testing Instructions:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Click anywhere on each task header to expand/collapse</li>
            <li>Test keyboard navigation: Tab to focus, Enter/Space to toggle</li>
            <li>Verify multiple cards can be expanded simultaneously</li>
            <li>Check chevron rotation animation on expand/collapse</li>
            <li>Verify TaskDetailsContent renders correctly when expanded</li>
            <li>Test mobile touch interactions if on mobile device</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TaskCardCollapsibleTest;