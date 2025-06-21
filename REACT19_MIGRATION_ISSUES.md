## Phase 2: Systematic Codebase Sweep

### 2.1 React Component Analysis

#### Component Analysis Progress - 2025-06-21T12:05:00Z

### Files Scanned: grep search across all `.tsx` & `.jsx` files in `src/`
- [x] src/components/ui/UnifiedErrorBoundary.tsx — Class component found (F2.1.1)
- [x] No other class components detected
- [x] No additional lifecycle methods (`componentDidMount`, `componentWillUnmount`) found
- [x] No HOC patterns detected in `src/components`

**Evidence:**
```bash
$ grep -R "extends Component" src/**/*.tsx src/**/*.jsx
# no matches except UnifiedErrorBoundary
$ grep -R "this.setState" src/**/*.tsx src/**/*.jsx
src/components/ui/UnifiedErrorBoundary.tsx:45:this.setState({ hasError: false, error: null });
```

### Active Findings:
#### F2.1.1 - Class Component Conversion Opportunity
- **File:** src/components/ui/UnifiedErrorBoundary.tsx:26-45
- **Pattern:** Class component with lifecycle methods (`getDerivedStateFromError`, `componentDidCatch`) and `setState`
- **Evidence:**
```26:45:src/components/ui/UnifiedErrorBoundary.tsx
class UnifiedErrorBoundary extends Component<UnifiedErrorBoundaryProps, UnifiedErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): UnifiedErrorBoundaryState { /* ... */ }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { /* ... */ }
  private handleRetry = () => { this.setState({ hasError: false, error: null }); };
}
```
- **React 19 Solution:** Convert to functional component using React 19 error boundary hooks (e.g., `useErrorBoundary`)
- **Status:** ✅ Verified

#### Representative Excerpts & References:
- Representative: ```26:45:src/components/ui/UnifiedErrorBoundary.tsx```
- Other class components: None.

### 2.2 State Management Deep Dive - 2025-06-21T12:10:00Z

#### State Flow Analysis - User Authentication State (F2.2.1)
**Chain Discovered:**
- `main.tsx:1-23` → `<StrictMode> → App` →
- `src/App.tsx:5-15` → `<AppProviders>` →
- `src/components/providers/AppProviders.tsx:35-37` → `<React.Suspense>` → children →
- `src/components/layout/AuthenticatedApp.tsx:10-15` → `useAuth()` returns `{ user, loading }` →
- `src/components/layout/TaskDashboardHeader.tsx:6-8` → `useAuth()` returns `{ user, signOut }`

**Props Passed:** None (hook/context-based consumption)

**Hook Complexity:**
- `useAuth` spans ~225 lines
- State variables: `user`, `session`, `loading`, `error`
- Effects: 2 (`initializeAuth`, `onAuthStateChange` listener)
- Callbacks: 4 (`logMobileDebug`, `updateSessionAndUser`, `clearAuthState`, `refreshSession`)
- Methods: `signIn`, `signOut`

**Test Coverage Analysis:**
- **No direct unit tests found** for `useAuth` hook
- Authentication flows tested indirectly via integration tests (`authFlow.integration.test.tsx`) but lacking edge case coverage:
  - Network failure during initial session fetch
  - `refreshSession` error handling
  - Concurrent calls to `signIn` and `signOut`

**Next Steps:**
- Add unit tests for `useAuth` covering:
  - Initial session success/failure
  - Auth state change notification
  - `signIn` error and success paths
  - `refreshSession` error handling

#### Representative Excerpts & References:
- Representative Hook Implementation: ```1:200:src/hooks/core/auth.ts```
- Additional usage: AuthenticatedApp (`10:15:src/components/layout/AuthenticatedApp.tsx`), TaskDashboardHeader (`6:8:src/components/layout/TaskDashboardHeader.tsx`).

### 2.3 Custom Hook Opportunities - 2025-06-21T12:15:00Z

### Pattern Analysis - 2025-06-21T12:15:00Z

#### P2.3.1 - Media & DOM Event Listener Duplication
**Signature Variants:**
- `useEffect`: uses `window.matchMedia(...).addEventListener('change', handler)` + cleanup  
- `useEffect`: uses `MutationObserver` on `document.documentElement` for class changes + `disconnect`

**Instances Found:** 3
1. `src/hooks/useMotionPreferences.ts` (lines 1-45): **MatchMedia** for `(prefers-reduced-motion)`
2. `src/contexts/ThemeContext.tsx` (lines 1-84): **MatchMedia** for dark mode + system preference
3. `src/hooks/ui/navbar.ts` via `setupThemeObserver` util (lines 1-87): **MutationObserver** for theme class changes

**Complexity Metrics:**
- `useMotionPreferences.ts`: ~45 LOC, 2 state hooks, 1 `useEffect`
- `ThemeContext.tsx`: ~84 LOC, 2 state hooks, 3 `useEffect` (init, apply theme, system change)
- `navbarColors.ts` + `setupThemeObserver`: ~87 LOC, computes styles then sets up observer

**Proposed Hook(s):**
- `useMediaQuery(query: string)`: abstracts `matchMedia` pattern
- `useThemeChange(callback: () => void)`: wraps `setupThemeObserver`

**Estimated Reduction:** ~30 lines × 2 (matchMedia) + ~15 lines (observer) = 75 lines

**Status:** 🔍 Investigating

#### P2.3.2 - Async Operation Loading State Duplication
**Signature:**
```ts
setLoading(true);
try { /* async work */ } catch { /* error */ } finally { setLoading(false); }
```
**Instances Found:** 4
1. `src/hooks/core/auth.ts`: `signIn` (lines 76-83)
2. `src/hooks/core/auth.ts`: `refreshSession` (lines 128-136)
3. `src/components/form/hooks/useUnifiedPhotoUpload.ts`: `handlePhotoChange` (lines 81-89)
4. `src/components/form/hooks/useUnifiedPhotoUpload.ts`: `uploadPhoto` (lines 109-117)

**Complexity Metrics:**
- `useAuth` patterns: ~10 LOC per method × 2 methods = ~20 LOC
- `useUnifiedPhotoUpload`: ~8 LOC per method × 2 methods = ~16 LOC
- Total duplicated lines: ~36 LOC across 4 blocks

**Additional Observations:**
- No `loading` state abstraction in `useTaskSubmission` or `useTaskQuery` hooks (`isSubmitting` and `isLoading` managed by React Query)
- Similar patterns in `useUsersQuery` and other query hooks but handled by React Query APIs

**Proposed Hook:** `useAsync<T>(fn: () => Promise<T>, deps?: any[])` →
returns `[runAsync, { loading, error }]` for uniform async handling

**Status:** 🔍 Investigating

**Next Steps:**
- Implement `useAsync` abstraction and refactor `useAuth` and `useUnifiedPhotoUpload`
- Audit other custom async hooks (e.g., `useTaskSubmission`, `useTaskFormSubmission`) for migration to `useAsync`

#### Representative Excerpts & References:
- P2.3.1 Representative: ```1:20:src/hooks/useMotionPreferences.ts```
- Other instances:
  - `24:40:src/contexts/ThemeContext.tsx`
  - `60:80:src/components/ui/navbar/utils/navbarColors.ts`
- P2.3.2 Representative: ```1:45:src/components/form/hooks/useUnifiedPhotoUpload.ts```
- Other instances:
  - `76:83:src/hooks/core/auth.ts`
  - `128:136:src/hooks/core/auth.ts`

### 2.4 React 19 Feature Opportunities - 2025-06-21T12:20:00Z

#### F2.4.1 - Suspense Boundary Optimization
- **Files & Fallback Complexity:**
  1. `CreateTaskPage.tsx`: inline fallback (8 LOC) with spinner + text
  2. `TaskDetailsPage.tsx`: two fallbacks (6 LOC each) for `CountdownTimer` and `TaskActions`
  3. `FollowUpTaskPage.tsx`: inline fallback (8 LOC) in `Suspense`
  4. `AppProviders.tsx`: `AppLoadingFallback` (12 LOC) in `<React.Suspense>`
  5. `App.tsx`: `AppLoadingFallback` (12 LOC)
- **Total duplicate fallback code:** ~40 LOC across 6 instances

- **Evidence:**
```bash
$ grep -R "fallback={" src/pages/CreateTaskPage.tsx src/pages/TaskDetailsPage.tsx src/pages/FollowUpTaskPage.tsx src/components/providers/AppProviders.tsx src/App.tsx
```

- **React 19 Solutions:**
  - Extract a shared `<LoadingFallback>` component configurable via props (size, message)
  - Replace inline fallback markup with `<LoadingFallback message="..." />`
  - Consolidate `AppLoadingFallback` into one reusable component for both `App` and providers

**Status:** 🔍 Investigating

#### F2.4.2 - React Actions Consolidation
**Forms & Submission Patterns:**
- Total form instances: ~6
  1. `ModernAuthForm.tsx` (server action via `action={action}`)
  2. `CreateTaskForm.tsx` (client `onSubmit` handler)
  3. `FollowUpTaskForm.tsx` (client `onSubmit` handler)
  4. `UnifiedTaskForm.tsx` (component receiving `onSubmit` prop)
  5. `SimplePhotoUploadModal.tsx` (client `onSubmit` prop)
  6. `UserSearchModal.tsx` (client `onSubmit` prop)

**Complexity Metrics:**
- Inline `onSubmit` handlers: ~30 LOC across 3 components
- Parameter handling and error logic duplicated in `CreateTaskForm` & `FollowUpTaskForm`
- UI submission states (`isPending` vs `isSubmitting`)混用 across forms

**Evidence:**
```bash
$ grep -R "<form action=" src/components/ui/auth/ModernAuthForm.tsx
$ grep -R "onSubmit=" src/features/tasks/forms/*.tsx src/components/form/**/*.tsx
```

**Proposed Migration:**
- Convert `CreateTaskForm` & `FollowUpTaskForm` to server actions using `useActionState`
- Deprecate `UnifiedTaskForm` receiving `onSubmit`; instead pass an `action` prop for server actions
- Standardize submission states via `useActionState` hook across forms

**Status:** 🔍 Investigating

#### F2.4.3 - `use()` Hook Adoption
- **Instances Found:** None (no direct `use()` usage detected)
- **Opportunity:** Simplify promise-based data fetching in server components by using React 19's `use()` hook instead of `useEffect`/`useState` patterns
- **Additional Opportunities:**
  - Convert purely presentational components (e.g., `ErrorDisplay`, `NotFound`, `AuthLoadingFallback`) into React Server Components
  - Replace `useSuspenseQuery` in `FollowUpTaskPage` with server component data fetching via `use()`
  - Identify static pages (e.g., 404 page) for server component conversion to reduce client bundle size

**Status:** 🔍 Investigating

#### Representative Excerpts & References:
- F2.4.1 (Suspense) Representative: ```33:45:src/pages/CreateTaskPage.tsx```
- Other Suspense instances:
  - `62:68:src/pages/TaskDetailsPage.tsx`
  - `138:149:src/pages/TaskDetailsPage.tsx`
  - `92:103:src/pages/FollowUpTaskPage.tsx`
- F2.4.2 (Actions) Representative: ```1:60:src/components/ui/auth/ModernAuthForm.tsx```
- Other form submission instances:
  - `18:28:src/features/tasks/forms/CreateTaskForm.tsx`
  - `95:105:src/features/tasks/forms/FollowUpTaskForm.tsx`
- F2.4.3 (`use()` Adoption) Representative static: ```1:28:src/pages/NotFound.tsx```

## Phase 3: Dependency and Architecture Analysis

### 3.1 Third-Party Dependency Audit - 2025-06-21T12:25:00Z

#### Current Dependencies Inventory:
- **Total dependencies:** 20
- **React-related:** `react@^19.1.0`, `react-dom@^19.1.0`
- **Routing:** `react-router-dom@^7.6.2`
- **Data fetching:** `@supabase/supabase-js@^2.49.6`, `@tanstack/react-query@^5.56.2`
- **Animation:** `@react-spring/web@^10.0.1`
- **Form validation:** `zod@^3.23.8`
- **UI primitives:** `@radix-ui/react-avatar`, `@radix-ui/react-dialog`, `@radix-ui/react-popover`, `@radix-ui/react-slot`, `@radix-ui/react-tooltip`, `@radix-ui/react-visually-hidden`
- **Utilities:** `clsx`, `class-variance-authority`, `date-fns`, `lucide-react`, `react-day-picker`, `sonner`, `tailwind-merge`, `tailwindcss-animate`

#### React 19 Overlap Analysis:
| Dependency            | React 19 Feature                   | Assessment Status | Action         |
|-----------------------|------------------------------------|-------------------|----------------|
| `@react-spring/web`   | `startTransition`, CSS transitions | Identified ✅      | Remove         |
| `@tanstack/react-query` | Server Components, `use()`       | Investigating 🔍  | Consider phase-out |
| `react-router-dom`    | Native React 19 routing            | Keep              |                |
| `zod`                 | Schema validation remains          | Keep              |                |

#### Redundancy Candidates:
- **@react-spring/web:** animations migrated to CSS and React 19 transition hooks → can remove
- **@tanstack/react-query:** data fetching to use server components and `use()` hook → possible removal after migration
- **lovable-tagger:** dev-only component tagging plugin; not needed in production → remove plugin usage
- **tailwindcss-animate:** animations consolidated into CSS/React 19 transitions → drop plugin
- **sonner:** notification library may be replaced with React 19 `useActionState` built-in notifications or native UI → evaluate
- **zod:** client-side validation replaced by server actions & React 19 form actions → possible consolidation to lighter-weight validation

#### Representative Excerpts & References:
- Dependencies snapshot: ```1:20:package.json```
- DevDependencies targets: lines 30-40: `lovable-tagger`, `tailwindcss-animate`, `sonner`, `zod`.

### 3.2 Import/Export Pattern Analysis - 2025-06-21T12:30:00Z

#### BE3.2.1 - `src/lib/utils/index.ts` (Utility Barrel)
- **Exports:** `ui`, `data`, `date`, `format`, `pagination`, `image`, `async`, `animation`, `createContext`
- **Impact after migration:**
  - Remove `animation` export when replacing CSS/transition utilities
  - Replace `async` utilities with new `useAsync` hook → update or remove
- **Evidence:**
```bash
$ sed -n '1,15p' src/lib/utils/index.ts
export * from './ui';
export * from './data';
export * from './date';
export * from './format';
export * from './pagination';
export * from './image/';
export * from './async';
export * from './animation';
export * from './createContext';
```
- **Status:** 🔍 Investigating update/removal of exports

#### BE3.2.2 - `src/lib/api/tasks/index.ts` (API Barrel)
- **Exports:** `TaskService` object with `crud`, `query`, `status`, `media`
- **Impact after migration:**
  - Consolidate service methods into server actions → deprecate TaskService
  - Remove wrappers around `withApiResponse` once standardized to server actions
- **Evidence:**
```bash
$ grep -R "export const TaskService" src/lib/api/tasks/index.ts
export const TaskService = {
  crud: { ... },
  query: { ... },
  status: { ... },
  media: { ... },
};
```
- **Status:** 🔍 Investigating migration path

#### BE3.2.3 - Component Barrel Exports
- `src/components/ui/auth/index.ts` → `ModernAuthForm` (remains)
- `src/components/ui/button/index.ts` → `Button` (remains)
- `src/hooks/ui/index.ts` → `useNavbar` (remains)
- **Evidence:**
```bash
$ sed -n '1,5p' src/components/ui/auth/index.ts
$ sed -n '1,5p' src/components/ui/button/index.ts
$ sed -n '1,5p' src/hooks/ui/index.ts
```
- **Impact after migration:** Confirm remaining exports; remove any unused re-exports
- **Status:** ✅ No immediate removals detected

#### Circular Dependency Scan
- **Method:** No reciprocal imports detected via grep
- **Evidence:**
```bash
$ grep -R "from '../" src
# no import cycling patterns found in initial scan
```

**Next Steps:**
- Run static analysis (e.g., madge) to confirm circular dependencies
- Update barrel files to remove deprecated exports once features migrated

#### Representative Excerpts & References:
- BE3.2.1 (Utility Barrel): ```1:9:src/lib/utils/index.ts```
- BE3.2.2 (API Barrel): ```1:20:src/lib/api/tasks/index.ts```
- BE3.2.3 (Component Barrels): ```1:5:src/components/ui/auth/index.ts``` and ```1:2:src/components/ui/button/index.ts```

## Phase 4: Configuration and Build Analysis

### 4.1 Build Configuration Review - 2025-06-21T12:35:00Z

#### Vite Configuration (`vite.config.ts`)
- **Plugins:** Uses `@vitejs/plugin-react-swc` for SWC compilation and `lovable-tagger` in development.  
  - *Opportunity:* Remove `lovable-tagger` plugin after migrating to React 19 patterns.  
- **Aliases:** `@` → `./src` (appropriate).  
- **Manual Chunks:** Splits vendor (`react`, `react-dom`), `@tanstack/react-query`, UI primitives, icons, router.  
  - *Opportunity:* Simplify chunking leveraging React 19 asset prefetching and server components.  
- **Sourcemaps:** Hidden in production; true in development.  
  - *Keep.*  

**Evidence:**
```bash
$ sed -n '1,50p' vite.config.ts
plugins: [react(), mode === 'development' && componentTagger()]
alias: { '@': path.resolve(__dirname, './src') }
build.rollupOptions.output.manualChunks
```

#### Tailwind Configuration (`tailwind.config.ts`)
- **Safelist:** Extensive dynamic classes for status indicators.  
  - *Opportunity:* After consolidating styles into components, reduce safelist to only truly dynamic classes.  
- **Plugins:** `tailwindcss-animate` for keyframes and animations.  
  - *Opportunity:* Remove if all animations replaced with React 19 transitions and CSS classes.  
- **Scan Paths:** Currently only scans `./src/**/*.{ts,tsx}`; misses raw CSS in `src/styles` and component CSS modules → update `content` to include CSS files.

**Evidence:**
```bash
$ grep -R "content:" tailwind.config.ts
```

#### ESLint Configuration (`eslint.config.js`)
- **React rules:** Already disables `react/react-in-jsx-scope`.  
- **Parser:** `typescript-eslint` with `ecmaVersion: 2022`, `jsx: true`.  
- **React version detection:** `detect` (OK).  
  - *Opportunity:* Review rules for React 19 server components (e.g., disable client-only rules).  

**Evidence:**
```bash
$ grep -R "react-refresh" eslint.config.js
$ grep -R "version: 'detect'" eslint.config.js
```

#### TypeScript Configuration (`tsconfig.app.json`)
- **JSX:** `react-jsx` (React 17+).  
- **Strict Mode:** `strict: true`, but root `tsconfig.json` has `strictNullChecks: false`.  
  - *Opportunity:* Enable `strictNullChecks` globally for consistent type safety.  

**Evidence:**
```bash
$ sed -n '1,20p' tsconfig.app.json | grep jsx
$ sed -n '1,20p' tsconfig.json | grep strictNullChecks
```

**Next Steps:**
- Remove or update plugins and manual chunks after migration.  
- Adjust Tailwind safelist and plugin usage.  
- Refine ESLint rules for React 19 features.  
- Enable `strictNullChecks` and consolidate TypeScript settings.

#### Representative Excerpts & References:
- Vite config: ```1:30:vite.config.ts```
- Tailwind config: ```1:25:tailwind.config.ts```
- ESLint config: ```1:20:eslint.config.js```
- TypeScript app config: ```1:20:tsconfig.app.json```

### 4.2 Type Definition Analysis - 2025-06-21T12:35:00Z

#### Duplicate and Redundant Types
- **Custom Async State Types:** `BaseAsyncState`, `AsyncOperationState`, etc. in `src/types/async-state.types.ts`.  
  - *Lines:* ~91 LOC
  - *Opportunity:* Replace with React 19 built-in `use()` error boundaries and transitions → remove or simplify.  
- **API Response Types:** `ApiResponse`, `ServiceResult` in `src/types/api.types.ts`.  
  - *Lines:* ~58 LOC
  - *Opportunity:* Consolidate into server action return types.  

#### React Context Type Helpers
- **`createStandardContext` utility types in `src/lib/utils/createContext.tsx`.**  
  - *Opportunity:* Replace with direct `createContext` & `useContext` generics → remove helper.  

#### Barrel Exports for Types
- **`src/types/index.ts`:** Aggregates domain, API, UI, form, pagination, async types.  
  - *Opportunity:* Remove exports for types powered by React 19 features (e.g., `BaseAsyncState`).  

**Evidence:**
```bash
$ grep -R "interface BaseAsyncState" src/types/async-state.types.ts
$ grep -R "export type.*ApiResponse" src/types/api.types.ts
$ grep -R "createStandardContext" src/lib/utils/createContext.tsx
```

**Next Steps:**
- Audit all exported types and remove those superseded by React 19 APIs.  
- Update barrel file (`src/types/index.ts`) accordingly to prune redundant exports.  

#### Representative Excerpts & References:
- Async state types: ```1:20:src/types/async-state.types.ts```
- API response types: ```1:20:src/types/api.types.ts```
- Context helper: ```1:50:src/lib/utils/createContext.tsx```

## Phase 5: Performance and Optimization Gaps

### 5.1 Rendering Optimization - 2025-06-21T12:40:00Z

#### F5.1 - Manual Memoization & Callback Patterns
- **Patterns Detected:**
  - `memo()` wrappers in ~25 components (e.g., `AuthFormHeader`, `DatePickerButton`, `GenericPagination`, `TaskCard`, `TimerRing`, `TaskExpandButton`, `UnifiedTaskForm`, etc.)
  - `useCallback()` used in ~30 hooks/components (e.g., `useAuth`, `useTaskNavigation`, `useTaskForm`, `QuickActionBar`, `TaskActions`, `TaskProviders`, etc.)
  - `useMemo()` used in ~20 instances for derived values (e.g., `contextValue` in Task contexts, calculation functions in hooks, styling computations)

**Evidence:**
```bash
$ grep -R "memo(" src/**/*.{tsx,jsx}
$ grep -R "useCallback" src/**/*.{ts,tsx,js,jsx}
$ grep -R "useMemo" src/**/*.{ts,tsx,js,jsx}
```

**React 19 Solutions:**
- Leverage React 19 automatic memoization and transitions; remove non-essential `memo()` and `useCallback()`/`useMemo()` usage
- Retain only performance-critical cases (e.g., heavy computation hooks)

**Status:** 🔍 Investigating

#### Representative Excerpts & References:
- Memo usage example: ```2:20:src/components/ui/auth/components/AuthFormHeader.tsx```

### 5.2 Data Flow Optimization - 2025-06-21T12:40:00Z

#### F5.2 - Server Components & Caching
- **Instances Found:**
  1. `src/pages/FollowUpTaskPage.tsx: import and useSuspenseQuery`
  2. `src/features/users/hooks/useUsersQuery.tsx: useSuspenseQuery`
  3. `src/features/tasks/hooks/useTaskQuery.tsx: useSuspenseQuery`
  4. `src/features/tasks/hooks/useTasksQuery.tsx: useSuspenseQuery`

**Evidence:**
```bash
$ grep -R "useSuspenseQuery" src/**/*.{ts,tsx}
```

**React 19 Opportunities:**
- Migrate data fetching to server components using `use()` for promise handling
- Eliminate client-side caching libraries (`@tanstack/react-query`) in favor of server-driven data

**Status:** 🔍 Investigating

#### Representative Excerpts & References:
- Suspense query example: ```1:30:src/pages/FollowUpTaskPage.tsx```
