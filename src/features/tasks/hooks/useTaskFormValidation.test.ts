import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTaskFormValidation } from './useTaskFormValidation';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('useTaskFormValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateTaskForm', () => {
    it('validates a valid task form', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const validData = {
        title: 'Test Task',
        description: 'Test description',
        dueDate: '2024-12-31',
        url: 'https://example.com',
        pinned: false,
        assigneeId: 'user-123',
        priority: 'medium',
      };
      
      const validation = result.current.validateTaskForm(validData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
      expect(validation.data).toMatchObject(validData);
    });

    it('validates form with minimal required fields', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const minimalData = {
        title: 'T',
        description: '',
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: '',
        priority: 'low',
      };
      
      const validation = result.current.validateTaskForm(minimalData);
      expect(validation.isValid).toBe(true);
    });

    it('fails validation for empty title', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const invalidData = {
        title: '',
        description: 'Test',
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: '',
        priority: 'medium',
      };
      
      const validation = result.current.validateTaskForm(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.title).toBe('Task title is required');
    });

    it('fails validation for title exceeding 22 characters', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const invalidData = {
        title: 'This is a very long title that exceeds the limit',
        description: '',
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: '',
        priority: 'medium',
      };
      
      const validation = result.current.validateTaskForm(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.title).toBe('Title cannot exceed 22 characters');
    });

    it('fails validation for description exceeding 500 characters', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const longDescription = 'a'.repeat(501);
      const invalidData = {
        title: 'Test',
        description: longDescription,
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: '',
        priority: 'medium',
      };
      
      const validation = result.current.validateTaskForm(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.description).toBe('Description cannot exceed 500 characters');
    });

    it('fails validation for invalid URL', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const invalidData = {
        title: 'Test',
        description: '',
        dueDate: '',
        url: 'not-a-valid-url',
        pinned: false,
        assigneeId: '',
        priority: 'medium',
      };
      
      const validation = result.current.validateTaskForm(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.url).toBe('Please enter a valid URL');
    });

    it('allows empty URL', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const validData = {
        title: 'Test',
        description: '',
        dueDate: '',
        url: '',
        pinned: false,
        assigneeId: '',
        priority: 'medium',
      };
      
      const validation = result.current.validateTaskForm(validData);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('validateCreateTask', () => {
    it('validates create task data with defaults', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const createData = {
        title: 'New Task',
        description: 'Description',
      };
      
      const validation = result.current.validateCreateTask(createData);
      expect(validation.isValid).toBe(true);
      expect(validation.data?.title).toBe('New Task');
      expect(validation.data?.description).toBe('Description');
      // Priority and status are optional in createTaskSchema
      expect(validation.data?.pinned).toBe(false);
    });

    it('validates with all fields', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const createData = {
        title: 'New Task',
        description: 'Description',
        priority: 'high',
        status: 'pending',
      };
      
      const validation = result.current.validateCreateTask(createData);
      expect(validation.isValid).toBe(true);
      expect(validation.data?.priority).toBe('high');
      expect(validation.data?.status).toBe('pending');
    });

    it('trims title whitespace', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const createData = {
        title: '  Trimmed Title  ',
      };
      
      const validation = result.current.validateCreateTask(createData);
      expect(validation.isValid).toBe(true);
      expect(validation.data?.title).toBe('Trimmed Title');
    });
  });

  describe('validateField', () => {
    it('validates title field', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      
      let validation = result.current.validateField('title', 'Valid Title');
      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
      
      validation = result.current.validateField('title', '');
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Task title is required');
      
      validation = result.current.validateField('title', 'A'.repeat(23));
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Title cannot exceed 22 characters');
    });

    it('validates description field', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      
      let validation = result.current.validateField('description', 'Valid description');
      expect(validation.isValid).toBe(true);
      
      validation = result.current.validateField('description', 'a'.repeat(501));
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Description cannot exceed 500 characters');
    });

    it('returns valid for unknown fields', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const validation = result.current.validateField('unknownField', 'any value');
      expect(validation.isValid).toBe(true);
    });
  });

  describe('validateTitle', () => {
    it('returns boolean for title validation', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      
      expect(result.current.validateTitle('Valid')).toBe(true);
      expect(result.current.validateTitle('')).toBe(false);
      expect(result.current.validateTitle('A'.repeat(23))).toBe(false);
    });
  });

  describe('createTitleSetter', () => {
    it('enforces 22 character limit', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const mockSetTitle = vi.fn();
      const setter = result.current.createTitleSetter(mockSetTitle);
      
      // Test valid title
      setter('Valid Title');
      expect(mockSetTitle).toHaveBeenCalledWith('Valid Title');
      
      // Test exactly 22 characters - need to count properly
      const exactly22 = '12345678901234567890AB'; // 22 characters
      setter(exactly22);
      expect(mockSetTitle).toHaveBeenCalledWith(exactly22);
      
      // Test title that's too long
      mockSetTitle.mockClear();
      setter('This title is way too long and exceeds limit');
      expect(mockSetTitle).not.toHaveBeenCalled();
    });
  });

  describe('prepareTaskData', () => {
    it('validates and returns transformed data', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      const formData = {
        title: '  Test Task  ',
        description: 'Description',
        pinned: true,
      };
      
      const prepared = result.current.prepareTaskData(formData);
      expect(prepared).not.toBeNull();
      expect(prepared?.title).toBe('Test Task');
      expect(prepared?.pinned).toBe(true);
    });

    it('returns null and shows errors for invalid data', () => {
      const { result } = renderHook(() => useTaskFormValidation());
      
      const invalidData = {
        title: '',
        description: 'Test',
      };
      
      const prepared = result.current.prepareTaskData(invalidData);
      expect(prepared).toBeNull();
      expect(toast.error).toHaveBeenCalledWith('Validation Failed', {
        description: expect.stringContaining('title:'),
      });
    });
  });
}); 