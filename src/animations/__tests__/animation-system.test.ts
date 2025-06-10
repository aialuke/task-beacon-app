/**
 * Animation System Tests
 * 
 * Tests for the unified animation system to ensure proper configuration
 * and motion preference handling.
 */

import { describe, it, expect } from 'vitest';

import {
  AnimationSystem,
  AnimationPresets,
  ComponentAnimations,
  useTaskCardAnimation,
  snappy,
} from '../index';

describe('Animation System', () => {
  describe('AnimationPresets', () => {
    it('should provide snappy preset with user-preferred settings', () => {
      expect(AnimationPresets.snappy).toEqual({
        tension: 190,
        friction: 35,
      });
    });

    it('should provide all required presets', () => {
      expect(AnimationPresets.gentle).toBeDefined();
      expect(AnimationPresets.snappy).toBeDefined();
      expect(AnimationPresets.quick).toBeDefined();
      expect(AnimationPresets.bounce).toBeDefined();
      expect(AnimationPresets.reduced).toBeDefined();
    });
  });

  describe('ComponentAnimations', () => {
    it('should use snappy preset for task card animations', () => {
      expect(ComponentAnimations.taskCard.expand).toEqual(AnimationPresets.snappy);
      expect(ComponentAnimations.taskCard.collapse).toEqual(AnimationPresets.snappy);
    });

    it('should provide all component configurations', () => {
      expect(ComponentAnimations.taskCard).toBeDefined();
      expect(ComponentAnimations.navbar).toBeDefined();
      expect(ComponentAnimations.timer).toBeDefined();
      expect(ComponentAnimations.modal).toBeDefined();
    });
  });

  describe('AnimationSystem', () => {
    it('should provide access to presets and components', () => {
      expect(AnimationSystem.presets).toBe(AnimationPresets);
      expect(AnimationSystem.components).toBe(ComponentAnimations);
    });

    it('should provide getConfig utility', () => {
      const normalConfig = { tension: 100, friction: 20 };
      const reducedConfig = { tension: 200, friction: 40 };

      // Normal motion
      expect(AnimationSystem.getConfig(normalConfig, reducedConfig, false)).toBe(normalConfig);

      // Reduced motion
      expect(AnimationSystem.getConfig(normalConfig, reducedConfig, true)).toBe(reducedConfig);
    });
  });

  describe('Hook exports', () => {
    it('should provide useTaskCardAnimation hook', () => {
      const result = useTaskCardAnimation();
      
      expect(result.expandConfig).toEqual(AnimationPresets.snappy);
      expect(result.collapseConfig).toEqual(AnimationPresets.snappy);
      expect(result.hoverConfig).toEqual(AnimationPresets.quick);
    });
  });

  describe('Direct exports', () => {
    it('should export individual presets', () => {
      expect(snappy).toEqual({
        tension: 190,
        friction: 35,
      });
    });
  });
}); 