# Architecture Decision: Feature-Based + Service Layer

## Decision

We use a hybrid feature-based architecture with a centralized service layer:

- `src/features/` - Feature-specific components, hooks, and logic
- `src/lib/` - Shared utilities, API services, and configuration
- `src/components/` - Reusable UI components

## Rationale

Provides clear feature boundaries while maintaining shared service consistency.

## Previous Architecture

The codebase previously contained empty `src/domain` and `src/application` directories that were
part of an abandoned Clean Architecture/DDD approach. These have been removed to eliminate confusion
and technical debt.

## Implementation Guidelines

- Feature-specific logic should be placed in `src/features/{feature-name}/`
- Shared business logic and API services belong in `src/lib/`
- Reusable UI components without business logic belong in `src/components/`
- Cross-cutting concerns (auth, validation, etc.) belong in `src/lib/`
