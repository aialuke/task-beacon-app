# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Task Beacon is a modern task management PWA built with React 19, TypeScript, and Supabase. Features include task creation/management, photo attachments, user collaboration, and real-time updates with performance optimization through code splitting and lazy loading.

## Quick Start

### Essential Commands
- `npm run dev` - Start development server (http://localhost:8080)
- `npm run test` - Run tests in watch mode
- `npm run lint` - Check code quality

### Environment Setup
Required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase public key

### Testing Strategy
- **Basic**: `npm run test:run` (all tests once)
- **Targeted**: `npm run test:api`, `npm run test:hooks`, `npm run test:components`
- **Advanced**: `npm run test:critical` (auth + task workflows), `npm run test:coverage`

## Core Architecture

### Structure & Technologies
**Feature-based architecture** with centralized services:
- `src/features/{feature}/` - Components, hooks, context, types per feature
- `src/lib/` - Shared API services, validation, utilities
- `src/components/` - Reusable UI components

**Tech Stack**: React 19 + TypeScript + Vite + Supabase + TanStack Query + Tailwind CSS

### Critical Patterns

#### 1. Standardized Context Creation
Use `createStandardContext` from `src/lib/utils/createContext.tsx` for all React contexts:
- Consistent error handling when used outside providers
- Standard provider creation with proper display names
- Examples: TaskDataContext, TaskUIContext, ThemeProvider

#### 2. API Service Architecture
All services in `src/lib/api/` follow unified patterns using React 19 optimizations:
- **Response Format**: `ApiResponse<T>` with `{ success, data, error }`
- **Error Handling**: Use `withApiResponse` utility from `src/lib/api/withApiResponse.ts` for consistent try-catch patterns
- **Query Keys**: Centralized in `src/lib/api/standardized-api.ts`
- **Suspense Integration**: Use `useSuspenseQuery` for automatic loading states

#### 3. State Management Strategy (React 19 Enhanced)
- **Server State**: TanStack Query with `useSuspenseQuery` for automatic error/loading states
- **Client State**: React Context for UI state (theme, filters) with enhanced batching
- **Forms**: React 19 `useActionState` pattern with server actions (see `src/lib/actions/authAction.ts`)
- **Form Validation**: Zod validation with unified schemas in `src/lib/validation/schemas.ts`
- **Task Context Hierarchy**: TaskDataContext (server) + TaskUIContext (client)
- **Transitions**: Use `startTransition` for non-urgent state updates and animations

#### 4. Performance & Error Handling (React 19 Optimized)
- **Code Splitting**: Manual chunks in vite.config.ts, lazy-loaded pages  
- **Error Boundaries**: Simplified `UnifiedErrorBoundary` leveraging React 19 enhanced error handling
- **Loading States**: Automatic via React 19 Suspense - no manual loading components needed
- **Animations**: CSS transitions with `startTransition` instead of animation libraries
- **Bundle Size**: ~110kB reduction achieved by eliminating duplicate patterns and unused dependencies

## Common Workflows

### Adding a New Feature
1. Create feature module: `src/features/{featureName}/`
2. Follow structure: `components/`, `hooks/`, `context/`, `types/`
3. Use `createStandardContext` for new contexts
4. Place API services in `src/lib/api/` (not feature-specific)
5. **Test**: `npm run test:components` then `npm run test:critical`

### Adding a New API Endpoint
1. Add function to appropriate service in `src/lib/api/`
2. Use `withApiResponse` wrapper for consistent error handling
3. Return `ApiResponse<T>` format for unified response structure
4. Add query key to `QueryKeys` object in `standardized-api.ts`
5. Use `useSuspenseQuery` in components for automatic loading/error states
6. **Test**: `npm run test:api`

### Creating React 19 Forms
1. **Server Actions**: Create action functions in `src/lib/actions/` following `authAction.ts` pattern
2. **Form Components**: Use `useActionState` instead of traditional controlled inputs
3. **Data Collection**: Use `FormData` instead of state for form values
4. **Validation**: Implement validation in server action with Zod schemas
5. **Error Handling**: Return error states through action response
6. **Example**: See `ModernAuthForm.tsx` for React 19 form implementation

### Creating a New Component
1. **UI Component**: Add to `src/components/ui/` following Shadcn patterns
2. **Feature Component**: Add to `src/features/{feature}/components/`
3. Use `UnifiedErrorBoundary` for error states and React 19 Suspense for loading
4. Leverage `startTransition` for non-urgent updates and smooth animations
5. Use unified `FloatingInput` component for consistent form inputs
6. **Test**: `npm run test:components`

### Fixing a Bug
1. Identify area: feature, API, or shared utility
2. Run targeted tests: `npm run test:{area}`
3. Use `npm run test:critical` to verify no regressions

## Dependency Impact Assessment

Before proposing architectural changes, always analyze integration risks:

### Critical Dependencies to Consider
- **TanStack Query**: Changes to API patterns must preserve 5-minute stale time, 3-retry logic, and error boundary behavior
- **Zod Schemas**: Form validation changes must maintain async validation capabilities and error formatting
- **React 19 Features**: Component changes should leverage (not just maintain compatibility with) automatic batching and enhanced Suspense
- **TypeScript Integration**: Ensure changes don't break strict mode or generated Supabase types

### Assessment Process
1. **Identify affected systems** - Map which dependencies your change touches
2. **Test compatibility** - Verify existing behavior is preserved
3. **Consider alternatives** - Sometimes leaving "duplication" is better than forced consolidation
4. **Document trade-offs** - Explain why complexity is justified (if it is)

## ⚠️ CRITICAL WORKFLOW RULE - NEVER DELETE BEFORE PRESERVE

**MANDATORY**: Before ANY content reduction, refactoring, or file modification:

1. **PRESERVE FIRST**: Create ALL new files with existing content
2. **VERIFY COMPLETE**: Confirm ALL original information is preserved  
3. **TEST ACCESS**: Verify ALL new files work and are accessible
4. **ONLY THEN**: Modify/reduce/streamline original content

**NEVER delete, edit, or reduce existing content until new preservation files are created and verified.**

See `NEVER_DELETE_BEFORE_PRESERVE_RULE.md` for complete workflow requirements.

---

## Available Tools & MCPs

Claude Code has access to several Model Context Protocol (MCP) tools for enhanced functionality:

### Research & Documentation
- **Context7**: `mcp__context7__resolve-library-id` and `mcp__context7__get-library-docs`
  - Use for researching best practices, library documentation, and external references
  - Always resolve library ID first, then fetch specific documentation

### Complex Analysis
- **Sequential Thinking**: `mcp__sequential-thinking__sequentialthinking`
  - Use for multi-step analysis, complex problem-solving, and systematic reasoning
  - Helps break down complex tasks and maintain context across multiple steps

### Knowledge Management
- **Memory System**: `mcp__memory__*` tools for entity/relation tracking
  - Create entities for important concepts, components, or patterns
  - Establish relations between related code elements
  - Add observations to track changes and insights

### Task Management
- **TodoWrite/TodoRead**: Built-in task tracking system
  - Use `TodoWrite` for complex multi-step tasks (3+ steps or non-trivial work)
  - Break down large requests into manageable, trackable todos
  - Mark todos as `in_progress` before starting, `completed` when finished
  - Only have one todo `in_progress` at a time

### Plan Mode
- **When to Use**: Activate when changes meet ANY of these criteria:
  - Affects 3+ files simultaneously
  - Modifies core architecture patterns (API response handling, context creation, validation flows)
  - Changes shared utilities used across multiple features
  - Introduces new dependencies or significantly alters existing dependency usage
  - Refactoring that could break existing functionality
- **Process**: Present analysis and plan using `exit_plan_mode` tool, wait for user approval
- **Required For**: Major refactoring, new feature implementation, architectural changes
- **Exception**: Simple component consolidation (removing obvious duplicates) may proceed without plan mode if limited to 1-2 files

## Key Development Rules

### Code Quality Patterns
- **Always prefer the simplest solution** - Before presenting any solution, actively work to simplify it. Your first thought is rarely the simplest approach.
- **Mandatory simplification step** - After conceiving a solution, ask: "How can this be made simpler?" Then present the simplified version.
- **Check existing before creating new** - Use `npm run analyze` and `Grep`/`Glob` tools to find similar code
- **Avoid code duplication** - Reference CODE_DUPLICATION_ANALYSIS_REPORT.md for known duplication patterns
- **Consolidate when found** - If creating something similar to existing code, consider refactoring both
- **Acceptable duplication** - Small, domain-specific variations may be acceptable for clarity

### Code Standards
- **Maintain test coverage** - Global 75%, API services 85%, Hooks 70%
- **Follow established patterns** - Use existing components/services as templates
- **Use TypeScript strictly** - Leverage generated Supabase types
- **Implement minimal complexity principle** - Always check existing implementations first

### Quality Assurance
- Run `npm run lint` and `npm run format` before commits
- Test changes with appropriate `npm run test:{area}` command
- Use `UnifiedErrorBoundary` and React 19 Suspense for consistent UX
- Leverage React 19 features: `useActionState`, `useSuspenseQuery`, `startTransition`
- Follow Cursor rules for systematic analysis and evidence-based claims

---

## Appendix: Advanced Configuration

### Testing Coverage Thresholds
- Global: 75% statements/functions/lines, 65% branches  
- API services (`src/lib/api/**`): 85% statements/functions/lines, 80% branches
- Hooks (`src/hooks/**`, `src/features/**/hooks/**`): 70% statements/functions/lines, 60% branches

### Performance Configuration
- Bundle chunks defined in `vite.config.ts` (vendor, tanstack, ui, icons, router)
- Network awareness in `AppProviders.tsx`
- React 19 Suspense for automatic loading states
- CSS transitions with `startTransition` for smooth animations
- Reduced bundle size: ~110kB savings from eliminating duplicate patterns
- `withApiResponse` utility eliminates API response duplication

### Cursor Rules
Claude Code follows behavioral rules in `.cursor/rules/behavior/` that govern analysis and code generation:

**Core Behavioral Rules:**
- **Cognitive Shortcut Detection**: Scan for lazy patterns before executing any rule
- **Evidence Enumeration**: Support all claims with specific file paths, line numbers, and examples
- **Mandatory Understanding Verification**: Verify understanding before proceeding with complex analysis
- **Minimal Complexity Principle**: Check existing implementations before creating new code
- **Systematic Completion Protocol**: Complete analysis before stating conclusions
- **Forced Continuation Trigger**: Continue analysis when urge to conclude arises

**Architectural Guidelines:**
- **Hexagonal Architecture**: Implement ports and adapters for external integrations
- **API Architecture**: Use Result types and functional error handling patterns
- **State Management**: Follow React Context and TanStack Query patterns
- **Type Safety**: Maintain strict TypeScript standards

**Rule Priority Order:**
1. Understanding verification (must verify before proceeding)
2. Evidence-based claims (all statements need tool-gathered evidence)
3. Minimal complexity (check existing before creating new)
4. Systematic completion (finish analysis before conclusions)

**Tool Usage Requirements:**
- Use `Grep`, `Glob`, `Read` tools when making claims about code structure
- Use `Task` tool for complex searches requiring multiple rounds
- Provide exact file paths and line numbers for all code references