import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  createTestQueryClient,
  createTestWrapper,
  TestProviders,
  renderWithProviders,
} from '../context-helpers';

describe('Context Helpers', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  describe('createTestQueryClient', () => {
    it('should create a query client with test configuration', () => {
      expect(queryClient).toBeInstanceOf(QueryClient);

      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.retry).toBe(false);
      expect(defaultOptions.mutations?.retry).toBe(false);
    });
  });

  describe('createTestWrapper', () => {
    it('should create a wrapper component', () => {
      const Wrapper = createTestWrapper({ queryClient });
      expect(Wrapper).toBeDefined();
      expect(typeof Wrapper).toBe('function');
    });

    it('should render children within providers', () => {
      const Wrapper = createTestWrapper({ queryClient });
      const TestComponent = () => (
        <div data-testid="test-component">Test Content</div>
      );

      render(
        <Wrapper>
          <TestComponent />
        </Wrapper>,
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('TestProviders', () => {
    it('should render children with all providers', () => {
      const TestComponent = () => (
        <div data-testid="test-component">Test Content</div>
      );

      render(
        <TestProviders>
          <TestComponent />
        </TestProviders>,
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  describe('renderWithProviders', () => {
    it('should render component with providers and return testing utilities', () => {
      const TestComponent = () => (
        <div data-testid="test-component">Test Content</div>
      );

      const utils = renderWithProviders(<TestComponent />);

      expect(utils.getByTestId('test-component')).toBeInTheDocument();
      expect(utils.queryClient).toBeInstanceOf(QueryClient);
    });

    it('should accept custom query client', () => {
      const customQueryClient = createTestQueryClient();
      const TestComponent = () => (
        <div data-testid="test-component">Test Content</div>
      );

      const utils = renderWithProviders(<TestComponent />, {
        queryClient: customQueryClient,
      });

      expect(utils.queryClient).toBe(customQueryClient);
    });
  });
});
