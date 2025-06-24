# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## 🚨 MANDATORY FIRST RESPONSE PROTOCOL - ABSOLUTE PRIORITY #1

**THIS IS THE FIRST AND MOST IMPORTANT RULE. CHECK THIS BEFORE READING ANYTHING ELSE.**

Before responding to ANY user request, you MUST:

1. **Check for Direct Questions First**:
   - Scan for question marks (?)
   - Look for "Why" / "How" / "What" at start of sentences
   - Detect challenges ("you ignored", "you didn't", "are you")
   - If found: STOP and address the question BEFORE any other work

2. **Output**: "Checking CLAUDE.md rules for this task..."
3. **List** which specific rules apply to the current request
4. **ONLY THEN** proceed with the actual work

### Example:
```
User: "Continue with Phase 2"
Assistant: "Checking CLAUDE.md rules for this task...
- CRITICAL VERIFICATION RULE applies - must verify all deletions with 4-command protocol
- Systematic Completion Protocol applies - must complete analysis before stating conclusions
- Evidence Enumeration applies - must provide specific file paths and line numbers
- Minimal Complexity Principle applies - must check existing implementations first

Now proceeding with Phase 2..."
```

### Required Rules to Check:
- Does this involve code deletion? → CRITICAL VERIFICATION RULE
- Does this involve analysis? → Systematic Completion Protocol + Evidence Enumeration
- Does this involve creating new code? → Minimal Complexity Principle
- Does this involve multi-step work? → TodoWrite/TodoRead requirements
- Does this affect 3+ files? → Plan Mode requirements
- Am I about to take a shortcut? → Cognitive Shortcut Detection (.cursor/rules)
- Am I rushing to conclude? → Forced Continuation Trigger (.cursor/rules)
- Am I making claims without evidence? → Mandatory Tool Usage (.cursor/rules)
- Do I need to verify my understanding? → Mandatory Understanding Verification (.cursor/rules)

**VIOLATION**: Failing to perform this check before starting work requires immediate acknowledgment and restart.

---

## Project Overview

Task Beacon is a modern task management PWA built with React 19, TypeScript, and Supabase. Features
include task creation/management, photo attachments, user collaboration, and real-time updates with
performance optimization through code splitting and lazy loading.

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
- **Error Handling**: Use `withApiResponse` utility from `src/lib/api/withApiResponse.ts` for
  consistent try-catch patterns
- **Query Keys**: Centralized in `src/lib/api/standardized-api.ts`
- **Suspense Integration**: Use `useSuspenseQuery` for automatic loading states

#### 3. State Management Strategy (React 19 Enhanced)

- **Server State**: TanStack Query with `useSuspenseQuery` for automatic error/loading states
- **Client State**: React Context for UI state (theme, filters) with enhanced batching
- **Forms**: React 19 `useActionState` pattern with server actions (see
  `src/lib/actions/authAction.ts`)
- **Form Validation**: Zod validation with unified schemas in `src/lib/validation/schemas.ts`
- **Task Context Hierarchy**: TaskDataContext (server) + TaskUIContext (client)
- **Transitions**: Use `startTransition` for non-urgent state updates and animations

#### 4. Performance & Error Handling (React 19 Optimized)

- **Code Splitting**: Manual chunks in vite.config.ts, lazy-loaded pages
- **Error Boundaries**: Simplified `UnifiedErrorBoundary` leveraging React 19 enhanced error
  handling
- **Loading States**: Automatic via React 19 Suspense - no manual loading components needed
- **Animations**: CSS transitions with `startTransition` instead of animation libraries
- **Bundle Size**: ~110kB reduction achieved by eliminating duplicate patterns and unused
  dependencies

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

1. **Server Actions**: Create action functions in `src/lib/actions/` following `authAction.ts`
   pattern
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

- **TanStack Query**: Changes to API patterns must preserve 5-minute stale time, 3-retry logic, and
  error boundary behavior
- **Zod Schemas**: Form validation changes must maintain async validation capabilities and error
  formatting
- **React 19 Features**: Component changes should leverage (not just maintain compatibility with)
  automatic batching and enhanced Suspense
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

**NEVER delete, edit, or reduce existing content until new preservation files are created and
verified.**

See `NEVER_DELETE_BEFORE_PRESERVE_RULE.md` for complete workflow requirements.

## 🚨 CRITICAL VERIFICATION RULE - MANDATORY TOOL OUTPUT VALIDATION

**ABSOLUTE REQUIREMENT**: Before making ANY changes based on tool outputs (Knip, ESLint, grep, etc.):

### 1. **MANDATORY VERIFICATION PROTOCOL**
- **NEVER trust tool outputs blindly** - all tools can have false positives
- **ALWAYS verify each reported issue** with manual code searches before fixing
- **VALIDATE every deletion candidate** with comprehensive usage searches
- **CONFIRM every "unused" export** is actually unused in the entire codebase

### 2. **REQUIRED VERIFICATION COMMANDS**
For each reported "unused" item, run ALL of these verification checks:
```bash
# Search for exact usage in all file types
rg "ExactItemName" . --type ts --type-add 'tsx:*.tsx' -t tsx -t js -n

# Search for partial usage (interfaces, types, imports)
rg "ExactItemName" . -n

# Search for usage in type annotations and extends clauses
rg ": ExactItemName|extends ExactItemName|implements ExactItemName" . -n

# Check if used as return type or parameter type
rg "ExactItemName[>\s]" . -n
```

### 3. **VERIFICATION DECISION MATRIX**
- ✅ **SAFE TO REMOVE**: Zero usage found in any verification search
- ❌ **DO NOT REMOVE**: Any usage found, even in same file as definition
- ⚠️ **INVESTIGATE**: Usage only in comments or documentation
- 🔄 **RE-EXPORT ONLY**: Used internally but not exported elsewhere

### 4. **ENFORCEMENT CHECKLIST**
Before ANY deletion, you MUST:
- [ ] Run all 4 verification commands above
- [ ] Document verification results in your response using the template below
- [ ] Explicitly state "VERIFIED SAFE" or "VERIFICATION FAILED" 
- [ ] If verification fails, explain why item should NOT be removed

#### Verification Output Template (MANDATORY)
When marking ANY item as verified, you MUST use this exact format:

```
VERIFYING: [ItemName]
Command 1: rg "ExactItemName" . --type ts --type-add 'tsx:*.tsx' -t tsx -t js -n
Output: [PASTE ACTUAL OUTPUT or "No results"]

Command 2: rg "ExactItemName" . -n  
Output: [PASTE ACTUAL OUTPUT or "No results"]

Command 3: rg ": ExactItemName|extends ExactItemName|implements ExactItemName" . -n
Output: [PASTE ACTUAL OUTPUT or "No results"]

Command 4: rg "ExactItemName[>\s]" . -n
Output: [PASTE ACTUAL OUTPUT or "No results"]

VERDICT: ✅ VERIFIED SAFE / ❌ ACTIVE USAGE FOUND
```

**PROHIBITED**: Writing "VERIFIED", "SAFE", or "✅" without this complete template.

### 5. **ZERO TOLERANCE POLICY**
- **ANY** deletion without prior verification is a critical error
- **ANY** bulk removal without individual verification is prohibited
- **ANY** "probably unused" assumptions are forbidden
- **EVERY** tool-reported issue requires independent verification

**Violation of this rule is grounds for immediate task suspension and requires explicit re-verification of all previous changes.**

## 🛑 COMPLETION CLAIM PROTOCOL

Before writing "COMPLETE", "DONE", "FINISHED", or marking any todo as completed, you MUST:

1. **Run status check**: `grep -n "NEEDS VERIFICATION\|PENDING\|⚠️" [current_file]`
2. **List all pending items**: Enumerate every item not yet verified
3. **Confirm zero pending**: Only proceed if grep returns no results
4. **State completion scope**: "X of Y items complete" (never just "complete")

Example:
```
Checking completion status...
Command: grep -n "NEEDS VERIFICATION\|PENDING\|⚠️" VERIFICATION_AUDIT_LOG.md
Output: 
- Line 112: TaskFilterProps - ⚠️ NEEDS VERIFICATION
- Line 114: TaskPriorityProps - ⚠️ NEEDS VERIFICATION

CANNOT claim complete - 2 items still pending verification.
```

## 📊 VERIFICATION PROGRESS TRACKING

When conducting any verification audit, maintain this tracker at the top of the document:

```
VERIFICATION PROGRESS TRACKER
Total Items: [X]
✅ Verified Safe: [Y] 
❌ Active Usage Found: [Z]
⚠️ Pending Verification: [X-Y-Z]
Last Updated: [timestamp of last verification]
```

Update this tracker after EACH individual verification, not in bulk.

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
- **Exception**: Simple component consolidation (removing obvious duplicates) may proceed without
  plan mode if limited to 1-2 files

## Key Development Rules

### Code Quality Patterns

- **Always prefer the simplest solution** - Before presenting any solution, actively work to
  simplify it. Your first thought is rarely the simplest approach.
- **Mandatory simplification step** - After conceiving a solution, ask: "How can this be made
  simpler?" Then present the simplified version.
- **Check existing before creating new** - Use `npm run analyze` and `Grep`/`Glob` tools to find
  similar code
- **Avoid code duplication** - Reference CODE_DUPLICATION_ANALYSIS_REPORT.md for known duplication
  patterns
- **Consolidate when found** - If creating something similar to existing code, consider refactoring
  both
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

### Mobile-First Interactive Feedback (ESLint Enforcement)

**Custom ESLint Rule Implemented**: `mobile-first/hover-without-active`

- **Automatically prevents hover-only violations** - Detects missing active/focus-visible states
- **Context7-validated suggestions** - Provides official Tailwind CSS best practice recommendations
- **Auto-fix support** - Basic auto-fix functionality for common patterns
- **Configurable exceptions** - Allows exclusions for special cases (transforms, animations)
- **Real-time feedback** - IDE integration provides immediate violation detection
- **Documentation**: See `ESLINT_MOBILE_FIRST_RULE.md` for complete rule documentation

**Enforced Patterns:**

- `hover:bg-*` requires `active:bg-* focus-visible:bg-*`
- `hover:text-*` requires `active:text-* focus-visible:text-*`
- `hover:opacity-*` requires `active:opacity-* focus-visible:opacity-*`
- `hover:underline` requires `active:underline focus-visible:underline`
- Container patterns use `focus-within:*` for child element focus

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

Claude Code follows behavioral rules in `.cursor/rules/behavior/` that govern analysis and code
generation:

**Core Behavioral Rules:**

- **Cognitive Shortcut Detection**: Scan for lazy patterns before executing any rule
- **Evidence Enumeration**: Support all claims with specific file paths, line numbers, and examples
- **Mandatory Understanding Verification**: Verify understanding before proceeding with complex
  analysis
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
