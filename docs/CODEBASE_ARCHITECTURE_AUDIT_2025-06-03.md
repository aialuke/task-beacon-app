# Task Beacon App – Architecture Audit Report (2025-06-03)

## Overview
This report summarizes the findings of a read-only architecture audit of the Task Beacon App codebase. The goal was to evaluate the current organisation, modularity, separation of concerns, and adherence to best practices, and to identify concrete, actionable steps to improve maintainability and developer experience. No code was modified during this audit.

---

## Key Findings

### 1. Separation of Concerns & Modularity
* **Strengths**
  * Feature-based directory layout (`src/features/*`) provides clear high-level boundaries.
  * Shared concerns (contexts, hooks, lib utilities) are extracted to top-level `src/` folders.
  * Functional React/TypeScript patterns and strict typing are used throughout.
* **Pain Points**
  * Validation logic is duplicated between **global** hooks (`src/hooks/useTaskValidation.ts`) and **feature** hooks (`src/features/tasks/hooks/useTaskValidation.ts`).
  * Several large *orchestrator* hooks (e.g. `useTaskFormOrchestrator`, `useTaskSubmission`) mix data fetching, UI side-effects (toasts / navigation), and domain logic, making them hard to reason about and test.
  * Some page-level components still contain business logic that belongs in feature hooks (e.g. `src/pages/TaskDetailsPage.tsx`).

### 2. File & Logic Placement
* **Misplaced or Redundant Files**
  * Duplicate type definitions for tasks inside both `src/types/` and `src/features/tasks/types/`.
  * API helpers exist in both `src/lib/api/` and `src/features/*/api/` with inconsistent conventions.
  * Multiple test files reference non-existent implementations (e.g. missing `useTaskFormValidation.test.ts` in some directories), indicating forgotten clean-up.

### 3. Coupling & Complexity
* Deep hook composition chains (up to 4-5 layers) create tight coupling and circular-dependency risk.
* Mixed state-management strategies – React Query, Context, local state – are used without clear guidelines, causing duplicated cache layers and synchronisation bugs.
* Component hierarchies in the *tasks* feature are nested 6-7 levels deep (`TaskCard → Header → Meta → …`), leading to prop-drilling and frequent re-renders.

### 4. Best-Practice Deviations
* Residual `console.log` / `console.debug` statements remain in production paths.
* Deprecated API methods are still exported for backward compatibility but never imported.
* Inconsistent error-handling – some API functions throw raw errors, others return `{ ok, error }` envelopes.

### 5. Test Coverage & Tooling
* Most core hooks have unit tests, but coverage is patchy – large orchestrator hooks lack direct tests.
* Duplicate tests exist for the same behaviour in global and feature-specific folders.
* ESLint and Knip reports list several unused exports and dead files that can be safely removed (`lint-report.json`, `knip-report.json`).

---

## Recommendations

Below is an ordered roadmap, from **most critical** to **optional enhancements**.

1. **Consolidate Validation & Form Logic (Critical)**
   * Merge global & feature-specific validation hooks into a *single canonical source* per domain (e.g. `src/features/tasks/validation/`).
   * Choose one validation strategy (Zod vs custom) and document it in `README.md`.
   * Delete redundant hooks/tests after migration.

2. **Refactor Large Orchestrator Hooks (Critical)**
   * Split `useTaskFormOrchestrator`, `useTaskSubmission`, etc. into smaller hooks focused on:
     1. State management
     2. Validation
     3. Side-effects (navigation / notifications)
   * Compose these in the component layer or a thin orchestrator that simply wires them together.

3. **Extract Business Logic from Pages (High)**
   * Move data fetching and transformations out of `src/pages/*.tsx` into feature hooks.
   * Keep pages limited to *routing & layout* concerns.

4. **Standardise State Management (High)**
   * Adopt React Query for server state; reserve Context for global UI preferences only.
   * Add a short ADR (architecture decision record) describing when to use which tool.
   * Remove redundant Context providers once migrated.

5. **Unify API Service Layer (Medium)**
   * Create a single `src/lib/apiClient.ts` that wraps fetch/Axios and centralises error handling & auth headers.
   * Deprecate legacy service functions; migrate features incrementally.

6. **Flatten Component Hierarchies (Medium)**
   * Convert deeply nested *TaskCard* sub-components into a *compound component* pattern to reduce prop-drilling.
   * Apply `React.memo` & `useMemo` selectively to prevent unnecessary re-renders.

7. **Centralise Types & Schemas (Medium)**
   * Store domain types in `src/features/<domain>/types/` and re-export via barrel.
   * Delete duplicate definitions in `src/types/` once consumers are migrated.

8. **Remove Dead / Legacy Code (Low)**
   * Use the existing Knip & ESLint unused-export reports as a to-do list.
   * Automate removal in CI using `pnpm knip --apply` or similar.

9. **Clean Up Logging & Error Handling (Low)**
   * Replace stray `console.*` with a typed logger abstraction that is a no-op in production.
   * Ensure API errors propagate as `Error` objects with contextual messages.

10. **Improve Documentation & On-boarding (Optional)**
    * Add README files to each feature explaining its public API (hooks, components, types).
    * Document state-management & validation conventions in `/docs/`.

11. **Performance & Bundle Optimisation (Optional)**
    * Enable React Lazy + Suspense for rarely visited routes.
    * Audit bundle with `source-map-explorer`; target 15 % size reduction through tree-shaking and code-splitting.

---

## Success Metrics
* Reduce duplicate hooks by **≥ 80 %** (from 2+ per concern to 1).
* Cut average hook file length to **< 150 lines**.
* Achieve **> 95 %** type reuse by eliminating duplicate interfaces.
* Improve Lighthouse performance score by **+10 points** after bundle optimisations.

---

## Conclusion
The Task Beacon App has a solid feature-based foundation but has accumulated duplication and complexity over time. Addressing the critical issues around validation duplication, oversized orchestrator hooks, and inconsistent state patterns will yield the highest impact on maintainability. The remaining recommendations will further streamline the developer experience and performance.

*No code was altered during this audit.* 