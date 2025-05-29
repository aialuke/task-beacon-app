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
├── components/        # Shared UI components and form utilities
│   ├── ui/            # Base UI components using Shadcn UI
│   ├── form/          # Reusable form components and hooks
│   ├── timer/         # Timer-related UI components
│   └── *.tsx          # Other shared components (AuthForm, ErrorBoundary, etc.)
├── contexts/          # Global context providers
│   ├── AuthContext.tsx       # Authentication context
│   └── ThemeContext.tsx      # Theme management context
├── features/          # Feature-based modules
│   └── tasks/         # Task management feature
│       ├── components/    # Task-specific UI components
│       ├── context/       # Task-specific state management
│       ├── forms/         # Task form components
│       ├── hooks/         # Task-related custom hooks
│       ├── pages/         # Task page components
│       ├── schemas/       # Validation schemas
│       └── types/         # Task-specific type definitions
├── hooks/             # Shared custom hooks
├── integrations/      # External service integrations
│   └── supabase/      # Supabase client and API layer
│       ├── api/           # API functions for Supabase
│       ├── client.ts      # Supabase client configuration
│       └── types/         # Supabase-related type definitions
├── lib/               # Utility functions and constants
│   ├── utils.ts           # Core utilities and common re-exports
│   ├── uiUtils.ts         # UI-related utility functions
│   ├── dataUtils.ts       # Data manipulation utilities
│   ├── dateUtils.ts       # Date-related utility functions
│   ├── validationUtils.ts # Input validation utilities
│   ├── formatUtils.ts     # Formatting utility functions
│   ├── animationUtils.ts  # Animation utility functions
│   ├── imageUtils.ts      # Image manipulation utilities
│   └── types.ts           # Shared type definitions
├── pages/             # Application pages/routes
├── schemas/           # Shared validation schemas
└── styles/            # Global styles and theme
```

## Key Architectural Patterns

### Feature-Based Organization

The application uses a feature-based folder structure which groups related components, hooks, and utilities by feature rather than by type. This makes it easier to understand the codebase and to locate related code.

Key principles:

- Each feature has its own directory with subdirectories for components, hooks, context, etc.
- Features should be self-contained with minimal dependencies on other features
- Common/shared code is placed in the root-level directories (components, lib, hooks)

### Component Organization Strategy

Components are organized into three main categories:

1. **UI Components** (`components/ui/`): Base components from Shadcn UI
2. **Shared Components** (`components/`): Reusable business logic components
3. **Feature Components** (`features/*/components/`): Feature-specific components

### Form Architecture

The application implements a standardized form pattern using:

1. **Form Validation Hook** (`useFormWithValidation`): Provides consistent form handling with Zod validation
2. **Specialized Form Hooks**: Feature-specific hooks that use the base validation hook
3. **Form Components**: Reusable form field components in `components/form/`

### API Layer

The application implements a dedicated API layer for Supabase interactions in `integrations/supabase/api/`. This layer:

1. Centralizes all data fetching logic
2. Provides standardized error handling
3. Offers strongly typed responses
4. Abstracts the underlying Supabase implementation from the rest of the application
5. Supports mocking for development and testing

### Custom Hooks Pattern

The application uses custom hooks extensively to:

1. Encapsulate complex logic
2. Separate concerns (UI from business logic)
3. Make components more readable and focused
4. Enable reuse across components

Hook organization:

- **Mutation Hooks**: Centralized in `useTaskMutations` for all task operations
- **Query Hooks**: Specific hooks for data fetching (e.g., `useTaskQueries`)
- **UI Hooks**: Handle component state and interactions (e.g., `useTaskCard`)
- **Validation Hooks**: Standardized validation using `useTaskFormValidation`

### Context API for State Management

The application uses React's Context API for sharing state across components:

1. **Global contexts**: Located in `/contexts`

   - `AuthContext`: Handles user authentication state
   - `ThemeContext`: Manages theme state

2. **Feature-specific contexts**: Located in feature directories
   - `TaskContext`: Manages task-related state and operations
   - `TaskUIContext`: Handles UI-specific state for tasks

### Import Pattern Standards

We follow these import standards throughout the codebase:

1. **Direct Imports (Preferred)**:

   ```typescript
   import { formatDate } from '@/lib/dateUtils';
   import { compressAndResizePhoto } from '@/lib/imageUtils';
   import { isValidEmail } from '@/lib/validationUtils';
   ```

2. **Selective Barrel Imports**:

   ```typescript
   import { cn, formatDate, truncateText } from '@/lib/utils';
   ```

3. **Feature Imports**:
   ```typescript
   import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
   ```

### Utility Function Organization

Utility functions are organized by domain:

- `utils.ts`: Common core utilities and selective re-exports
- Domain-specific utilities organized by function:
  - `uiUtils.ts`: UI helper functions
  - `dataUtils.ts`: Data transformation
  - `dateUtils.ts`: Date operations
  - `validationUtils.ts`: Input validation
  - `formatUtils.ts`: String formatting
  - `animationUtils.ts`: Animation calculations
  - `imageUtils.ts`: Image processing

## Data Flow

1. **Data Fetching**: TanStack Query handles data fetching via the Supabase API layer
2. **State Management**: Context providers manage global and feature-specific state
3. **UI Updates**: Components consume context and query results to render the UI
4. **User Interactions**: Event handlers trigger mutations through centralized hooks
5. **Optimistic Updates**: TanStack Query provides optimistic updates for better UX

## Responsive Design Pattern

The application implements responsive design using:

1. Tailwind CSS responsive utilities
2. Layout components that adapt to screen size
3. Context to track viewport size and device type
4. Custom hooks (e.g., `use-mobile`) to adapt functionality based on screen size

## Animation Patterns

Task cards use animation utilities for smooth transitions:

1. `animationUtils.ts` provides timer calculations and animation helpers
2. CSS transitions handle basic animations
3. React Spring is used for more complex animations with performance optimizations

## Testing Approach

The application uses:

1. **Jest** as the test runner and assertion library
2. **React Testing Library** for component testing
3. **Mock Supabase Client** for testing without real API calls
4. **Unit tests** for utility functions and hooks
5. **Component tests** for UI elements

## Deployment and Build Process

The application is built with Vite and can be deployed as a Progressive Web App with offline capabilities. The build process optimizes assets and generates appropriate PWA manifests and service workers.
