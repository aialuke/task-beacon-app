# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Common Development Commands

### Development Server

- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build
- `npm run build:dev` - Development build

### Testing

- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run all tests once
- `npm run test:unit` - Run unit tests only (excludes integration/e2e)
- `npm run test:integration` - Run integration tests only
- `npm run test:components` - Run component tests only
- `npm run test:hooks` - Run hook tests only
- `npm run test:api` - Run API tests only
- `npm run test:critical` - Run critical path tests (auth, task workflows)
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests for CI with JUnit output

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run analyze` - Analyze codebase with Knip for unused code
- `npm run analyze:fix` - Fix unused code issues automatically

## Architecture Overview

### Core Structure

The app uses a **feature-based architecture** with centralized services:

- `src/features/` - Feature modules (tasks, auth, users, dashboard, profile)
- `src/lib/` - Shared utilities, API services, validation, and configuration
- `src/components/` - Reusable UI components (form, layout, providers, ui)
- `src/shared/` - Cross-cutting concerns and utilities

### Feature Organization

Each feature follows a consistent structure:

```
src/features/{feature}/
├── components/     # Feature-specific components
├── hooks/         # Feature-specific hooks
├── services/      # Feature-specific API services
├── types/         # Feature-specific types
├── context/       # Feature-specific contexts
└── utils/         # Feature-specific utilities
```

### Key Technologies

- **Frontend**: React 19, TypeScript, Vite, React Router 7
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: TanStack Query v5, React Context
- **Styling**: Tailwind CSS, Shadcn UI, CSS custom properties
- **Testing**: Vitest, React Testing Library, JSDOM
- **Performance**: Code splitting, lazy loading, bundle optimization

### State Management Patterns

1. **Server State**: TanStack Query for API data with 5-minute stale time
2. **Client State**: React Context for UI state (theme, auth status)
3. **Form State**: Zod validation with custom hooks
4. **Caching**: Intelligent query caching with standardized retry logic (3 attempts)

### Data Layer

- **Supabase Client**: Located in `src/integrations/supabase/client.ts`
- **API Services**: Centralized in `src/lib/api/` with standardized error handling
- **Type Definitions**: Database types in `src/integrations/supabase/types.ts`
- **Validation**: Unified Zod schemas in `src/lib/validation/schemas.ts`

### Component Architecture

- **UI Components**: Shadcn-based in `src/components/ui/`
- **Feature Components**: Domain-specific in `src/features/{feature}/components/`
- **Provider Hierarchy**: Centralized in `src/components/providers/AppProviders.tsx`
- **Error Boundaries**: Unified error handling with `UnifiedErrorBoundary`

### Performance Optimizations

- Lazy-loaded pages with React.lazy()
- Bundle splitting for heavy components
- Image optimization with WebP support
- Network-aware component preloading
- Vitest coverage thresholds configured (60% global, 80% for critical paths)

### Testing Strategy

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Feature workflow testing
- **Component Tests**: UI component behavior testing
- **API Tests**: Service layer testing
- **Critical Path Tests**: Auth and task workflow validation

### Environment Configuration

- Development server runs on `http://localhost:8080`
- Supabase environment variables required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- Feature flags controlled via `src/lib/config/app.ts`

### Key Contexts and Providers

1. **AppProviders**: Root provider composition with error boundaries
2. **ThemeProvider**: Theme management
3. **TaskDataContext**: Server-side task data with pagination
4. **TaskUIContext**: UI state for task interactions

### Routing Structure

- `/` - Authentication page
- `/create-task` - Task creation
- `/follow-up-task/:parentTaskId` - Follow-up task creation
- `/tasks/:id` - Task details
- `*` - 404 Not Found

## Development Notes

### Code Style Preferences

- TypeScript strict mode enabled
- Functional components with hooks
- Tailwind CSS for styling with design tokens
- Custom hooks for complex logic extraction
- Error boundaries for graceful failure handling

### Testing Approach

The project uses comprehensive testing with specific commands for different test types. Always run
the appropriate test suite when making changes to specific areas of the codebase.

### Bundle Analysis

Use `npm run analyze` to identify unused code and optimize bundle size. The project uses Knip for
dead code elimination.

## Cursor Rules Integration

Claude Code should follow the project-specific rules defined in the following Cursor Rules files:

- @.cursor/rules/behavior/cognitive-shortcut-detection.mdc
- @.cursor/rules/behavior/evidence-enumeration-requirement.mdc
- @.cursor/rules/behavior/execution-precedence-heirarchy.mdc
- @.cursor/rules/behavior/forced-continuation-trigger.mdc
- @.cursor/rules/behavior/mandatory-tool-usage.mdc
- @.cursor/rules/behavior/mandatory-understanding-verification.mdc
- @.cursor/rules/behavior/minimal-complexity-principle.mdc
- @.cursor/rules/behavior/systematic-completion-protocol.mdc
