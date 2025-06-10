import { validateSorting } from '../validators';

describe('validateSorting', () => {
  it('should validate correct sorting parameters', () => {
    const validSorting = {
      field: 'created_at',
      order: 'desc' as const,
    };
    
    const result = validateSorting(validSorting);
    expect(result.success).toBe(true);
  });

  it('should validate all allowed sort fields', () => {
    const allowedFields = ['created_at', 'updated_at', 'due_date', 'title', 'priority', 'status'];
    
    allowedFields.forEach(field => {
      const result = validateSorting({ field, order: 'asc' });
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid sort fields', () => {
    const invalidSorting = {
      field: 'invalid_field',
      order: 'desc' as const,
    };
    
    const result = validateSorting(invalidSorting);
    expect(result.success).toBe(false);
  });

  it('should reject invalid order values', () => {
    const invalidSorting = {
      field: 'created_at',
      order: 'invalid_order',
    };
    
    const result = validateSorting(invalidSorting);
    expect(result.success).toBe(false);
  });

  it('should default order to asc', () => {
    const sorting = {
      field: 'created_at',
    };
    
    const result = validateSorting(sorting);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.order).toBe('asc');
    }
  });

  it('should reject missing field', () => {
    const invalidSorting = {
      order: 'desc' as const,
    };
    
    const result = validateSorting(invalidSorting);
    expect(result.success).toBe(false);
  });
}); 