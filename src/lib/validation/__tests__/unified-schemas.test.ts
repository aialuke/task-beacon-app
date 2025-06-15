
import { describe, it, expect } from 'vitest';

import { validateUnifiedTask } from '../unified-schemas';

describe('Unified Schemas', () => {
  describe('validateUnifiedTask', () => {
    it('should validate a valid task', () => {
      const validTask = {
        title: 'Test Task',
        description: 'Test Description',
        url: 'https://example.com',
        dueDate: '2024-12-31',
        assigneeId: 'user-123',
        priority: 'medium',
      };

      const result = validateUnifiedTask(validTask);
      
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validTask);
    });

    it('should reject invalid task data', () => {
      const invalidTask = {
        title: '', // Empty title should be invalid
        description: 'Test Description',
      };

      const result = validateUnifiedTask(invalidTask);
      
      expect(result.isValid).toBe(false);
      expect(result.fieldErrors).toBeDefined();
    });

    it('should handle missing required fields', () => {
      const incompleteTask = {
        description: 'Test Description',
        // Missing title
      };

      const result = validateUnifiedTask(incompleteTask);
      
      expect(result.isValid).toBe(false);
      expect(result.fieldErrors).toBeDefined();
    });
  });
});
