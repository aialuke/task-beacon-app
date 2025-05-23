
# Task Management Application Architecture

## Overview

This document outlines the architecture of the Task Management Progressive Web Application. The application follows a component-based architecture using React and embraces modern frontend patterns for state management, data fetching, and UI composition.

## Core Technologies

- **React**: Component library for building the user interface
- **TypeScript**: Static typing for improved developer experience and code quality
- **Supabase**: Backend-as-a-service for authentication and data storage
- **TanStack Query (React Query)**: Data fetching, caching, and state management
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Component library built on Radix UI primitives

## Application Structure

```
src/
├── components/        # Shared UI components
├── contexts/          # Global state and context providers
├── features/          # Feature-based modules
│   └── tasks/         # Task management feature
│       ├── components/    # Task-specific UI components
│       ├── context/       # Task-specific state management
│       ├── forms/         # Task form components
│       ├── hooks/         # Task-related custom hooks
│       ├── pages/         # Task page components
│       ├── schemas/       # Validation schemas
│       └── types.ts       # Task-specific type definitions
├── hooks/             # Shared custom hooks
├── integrations/      # External service integrations
│   └── supabase/      # Supabase client and API layer
│       ├── api/           # API functions for Supabase
│       ├── client.ts      # Supabase client configuration
│       └── types/         # Supabase-related type definitions
├── lib/               # Utility functions and constants
├── pages/             # Application pages/routes
└── styles/            # Global styles and theme
```

## Key Architectural Patterns

### Feature-Based Organization

The application uses a feature-based folder structure which groups related components, hooks, and utilities by feature rather than by type. This makes it easier to understand the codebase and to locate related code.

### API Layer

The application implements a dedicated API layer for Supabase interactions in `integrations/supabase/api/`. This layer:

1. Centralizes all data fetching logic
2. Provides standardized error handling
3. Offers strongly typed responses
4. Supports mocking for development and testing

### Custom Hooks Pattern

The application uses custom hooks extensively to:

1. Encapsulate complex logic
2. Separate concerns (UI from business logic)
3. Make components more readable and focused
4. Enable reuse across components

Examples include `useTaskContext`, `useCreateTask`, and `useFilteredTasks`.

### Context API for State Management

The application uses React's Context API for sharing state across components:

1. `TaskContext`: Manages task-related state and operations
2. `AuthContext`: Handles user authentication state
3. `UIContext`: Manages UI-related state like themes and layouts

### Responsive Animation Patterns

Task cards use React Spring for smooth animations with performance optimizations:

1. Height transitions for expanding/collapsing cards
2. Opacity transitions for content fade in/out
3. Transform transitions for position adjustments

### Form Patterns

Form handling uses a combination of:

1. Base form hooks for shared form logic
2. Specialized form hooks for specific use cases
3. Validation using either:
   - Simple validation functions for basic cases
   - Zod schemas for complex validation scenarios

## Data Flow

1. **Data Fetching**: TanStack Query handles data fetching via the Supabase API layer
2. **State Management**: Context providers manage global state
3. **UI Updates**: Components consume context and query results to render the UI
4. **User Interactions**: Event handlers trigger mutations through the API layer
5. **Optimistic Updates**: TanStack Query provides optimistic updates for better UX

## Testing Approach

The application uses:

1. **Jest** as the test runner and assertion library
2. **React Testing Library** for component testing
3. **Mock Supabase Client** for testing without real API calls
4. **Unit tests** for utility functions and hooks
5. **Component tests** for UI elements

## Deployment and Build Process

The application is built with Vite and can be deployed as a Progressive Web App with offline capabilities. The build process optimizes assets and generates appropriate PWA manifests and service workers.
